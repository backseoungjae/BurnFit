/**
 * @file useInfinitePager.ts
 * @description 캘린더의 가로 페이징 및 무한 스크롤 관련 로직을 관리하는 커스텀 훅입니다.
 *
 * @description
 * `FlatList`에 필요한 페이지 데이터(`pages`)를 동적으로 생성하고,
 * 사용자가 스크롤 끝에 가까워지면 이전/다음 페이지 데이터를 미리 생성하여 무한 스크롤을 구현합니다.
 * 또한, 이전/다음 달로 이동하는 버튼(`onPressPrev`, `onPressNext`)과 스크롤 위치를 동기화하는 로직(`handlePageMomentumEnd`)을 포함합니다.
 */
import { useCallback, useMemo, useRef, useState } from 'react';
import type { PageData, ViewMode, YearMonth } from '../calendarTypes';
import {
  buildMonthMatrix,
  buildWeekDays,
  getYearMonthFrom,
  weekStartSunday,
} from '../calendarUtils';

const MONTH_CHUNK = 24;
const WEEK_CHUNK = 26;
const EDGE_BUFFER = 6;

const initialOffsets = (chunk: number) =>
  Array.from({ length: chunk * 2 + 1 }, (_, i) => i - chunk);

type UseInfinitePagerProps = {
  viewMode: ViewMode;
  year: number;
  monthIndex: number;
  weekAnchorDate: Date;
  setYM: React.Dispatch<React.SetStateAction<YearMonth>>;
  setWeekAnchorDate: React.Dispatch<React.SetStateAction<Date>>;
};

export function useInfinitePager({
  viewMode,
  year,
  monthIndex,
  weekAnchorDate,
  setYM,
  setWeekAnchorDate,
}: UseInfinitePagerProps) {
  const [monthOffsets, setMonthOffsets] = useState<number[]>(() =>
    initialOffsets(MONTH_CHUNK),
  );
  const [weekOffsets, setWeekOffsets] = useState<number[]>(() =>
    initialOffsets(WEEK_CHUNK),
  );

  const monthCenterIndexRef = useRef<number>(MONTH_CHUNK);
  const weekCenterIndexRef = useRef<number>(WEEK_CHUNK);

  const [scrollReq, setScrollReq] = useState<{
    index: number;
    animated: boolean;
    seq: number;
  } | null>(null);

  const requestScroll = useCallback((index: number, animated: boolean) => {
    setScrollReq({ index, animated, seq: Date.now() });
  }, []);

  const extend = useCallback(
    (mode: 'month' | 'week', dir: 'start' | 'end') => {
      if (mode === 'month') {
        setMonthOffsets(prev => {
          if (dir === 'end') {
            const last = prev[prev.length - 1];
            const more = Array.from(
              { length: MONTH_CHUNK },
              (_, i) => last + i + 1,
            );
            return [...prev, ...more];
          } else {
            const first = prev[0];
            const more = Array.from(
              { length: MONTH_CHUNK },
              (_, i) => first - MONTH_CHUNK + i,
            );
            const next = [...more, ...prev];
            monthCenterIndexRef.current += MONTH_CHUNK;
            setTimeout(
              () => requestScroll(monthCenterIndexRef.current, false),
              0,
            );
            return next;
          }
        });
      } else {
        setWeekOffsets(prev => {
          if (dir === 'end') {
            const last = prev[prev.length - 1];
            const more = Array.from(
              { length: WEEK_CHUNK },
              (_, i) => last + i + 1,
            );
            return [...prev, ...more];
          } else {
            const first = prev[0];
            const more = Array.from(
              { length: WEEK_CHUNK },
              (_, i) => first - WEEK_CHUNK + i,
            );
            const next = [...more, ...prev];
            weekCenterIndexRef.current += WEEK_CHUNK;
            setTimeout(
              () => requestScroll(weekCenterIndexRef.current, false),
              0,
            );
            return next;
          }
        });
      }
    },
    [requestScroll],
  );

  const extendEnd = useCallback(
    (mode: 'month' | 'week') => extend(mode, 'end'),
    [extend],
  );
  const extendStart = useCallback(
    (mode: 'month' | 'week') => extend(mode, 'start'),
    [extend],
  );

  const onPressPrev = useCallback(() => {
    const isMonth = viewMode === 'month';
    const cur = isMonth
      ? monthCenterIndexRef.current
      : weekCenterIndexRef.current;
    const next = Math.max(0, cur - 1);
    requestScroll(next, true);
  }, [viewMode, requestScroll]);

  const onPressNext = useCallback(() => {
    const isMonth = viewMode === 'month';
    const offsets = isMonth ? monthOffsets : weekOffsets;
    const cur = isMonth
      ? monthCenterIndexRef.current
      : weekCenterIndexRef.current;
    const next = Math.min(offsets.length - 1, cur + 1);
    requestScroll(next, true);
  }, [viewMode, monthOffsets, weekOffsets, requestScroll]);

  const handlePageMomentumEnd = useCallback(
    (nextIndex: number) => {
      const isMonth = viewMode === 'month';
      const offsets = isMonth ? monthOffsets : weekOffsets;
      const centerIndexRef = isMonth ? monthCenterIndexRef : weekCenterIndexRef;
      const prevIndex = centerIndexRef.current;

      if (nextIndex !== prevIndex) {
        const centerVal = offsets[prevIndex];
        const nextVal = offsets[nextIndex];
        const delta = nextVal - centerVal;

        if (isMonth) {
          const base = new Date(year, monthIndex, 1);
          const next = new Date(base);
          next.setMonth(base.getMonth() + delta);
          setYM(getYearMonthFrom(next));
          centerIndexRef.current = nextIndex;
        } else {
          const baseStart = weekStartSunday(weekAnchorDate);
          const nextStart = new Date(baseStart);
          nextStart.setDate(baseStart.getDate() + delta * 7);
          setWeekAnchorDate(nextStart);
          centerIndexRef.current = nextIndex;
        }
      }

      const len = offsets.length;
      if (nextIndex >= len - EDGE_BUFFER) {
        extendEnd(viewMode);
      } else if (nextIndex <= EDGE_BUFFER) {
        extendStart(viewMode);
      }
    },
    [
      viewMode,
      monthOffsets,
      weekOffsets,
      year,
      monthIndex,
      weekAnchorDate,
      extendEnd,
      extendStart,
      setYM,
      setWeekAnchorDate,
    ],
  );

  const pages: PageData[] = useMemo(() => {
    if (viewMode === 'month') {
      const offsets = monthOffsets;
      const centerVal = offsets[monthCenterIndexRef.current] ?? 0;
      const base = new Date(year, monthIndex, 1);
      return offsets.map(off => {
        const rel = off - centerVal;
        const pageDate = new Date(base);
        pageDate.setMonth(base.getMonth() + rel);
        const { year: y, monthIndex: m } = getYearMonthFrom(pageDate);
        return { key: `m-${off}`, days: buildMonthMatrix(y, m), monthIndex: m };
      });
    } else {
      const offsets = weekOffsets;
      const centerVal = offsets[weekCenterIndexRef.current] ?? 0;
      const baseStart = weekStartSunday(weekAnchorDate);
      return offsets.map(off => {
        const rel = off - centerVal;
        const pageStart = new Date(baseStart);
        pageStart.setDate(pageStart.getDate() + rel * 7);
        return {
          key: `w-${off}`,
          days: buildWeekDays(pageStart),
          monthIndex: pageStart.getMonth(),
        };
      });
    }
  }, [viewMode, monthOffsets, weekOffsets, year, monthIndex, weekAnchorDate]);

  const currentIndex =
    viewMode === 'month'
      ? monthCenterIndexRef.current
      : weekCenterIndexRef.current;

  return {
    pages,
    currentIndex,
    scrollReq,
    onPressPrev,
    onPressNext,
    handlePageMomentumEnd,
    requestScroll,
    monthCenterIndexRef,
    weekCenterIndexRef,
  };
}
