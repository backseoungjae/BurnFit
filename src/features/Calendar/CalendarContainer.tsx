/**
 * @file CalendarContainer.tsx
 * @description 캘린더 기능의 메인 컨테이너 컴포넌트입니다.
 *
 * @property {React.Component} Calendar - 캘린더 UI를 렌더링하는 뷰 컴포넌트
 * @property {React.Component} DailyRecordTabs - 식단, 운동, 신체 기록을 관리하는 탭 컴포넌트
 *
 * @state {ViewMode} viewMode - 현재 캘린더 뷰 모드 ('month' 또는 'week')
 * @state {Date} today - 오늘 날짜
 * @state {YearMonth} year, monthIndex - 현재 캘린더가 표시하는 년도와 월
 * @state {Date | null} selectedDate - 사용자가 선택한 날짜
 * @state {Date} weekAnchorDate - 주 단위 뷰에서 기준이 되는 날짜
 *
 * @hook {useInfinitePager} - 가로 페이징, 무한 스크롤 로직을 관리하는 커스텀 훅
 * @hook {useVerticalTransition} - 월/주 뷰 전환 제스처 및 애니메이션 로직을 관리하는 커스텀 훅
 *
 * @description
 * 캘린더의 핵심 상태(날짜, 뷰 모드 등)를 관리하고,
 * `useInfinitePager`와 `useVerticalTransition` 훅을 통해 복잡한 UI 로직을 조립합니다.
 * 최종적으로 계산된 상태와 핸들러 함수들을 `Calendar` 뷰 컴포넌트로 전달하여 UI를 렌더링하는 오케스트레이터 역할을 합니다.
 */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  LinearTransition,
  withTiming,
} from 'react-native-reanimated';
import { StyleSheet } from 'react-native';

import Calendar from './Calendar';
import DailyRecordTabs from './DailyRecordTabs';
import { MONTH_GRID_H, WEEK_GRID_H } from './calendarConstants';
import type { YearMonth } from './calendarTypes';
import {
  formatTitle,
  getYearMonthFrom,
  weekStartSunday,
} from './calendarUtils';
import { useInfinitePager } from './hooks/useInfinitePager';
import { useVerticalTransition } from './hooks/useVerticalTransition';

const SNAP_DUR = 220;
const SNAP_EASING = Easing.out(Easing.cubic);

export default function CalendarContainer() {
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const today = useMemo(() => new Date(), []);
  const [{ year, monthIndex }, setYM] = useState<YearMonth>(
    getYearMonthFrom(today),
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(today);
  const [weekAnchorDate, setWeekAnchorDate] = useState<Date>(today);

  const {
    pages,
    currentIndex,
    scrollReq,
    onPressPrev,
    onPressNext,
    handlePageMomentumEnd,
    requestScroll,
    monthCenterIndexRef,
    weekCenterIndexRef,
  } = useInfinitePager({
    viewMode,
    year,
    monthIndex,
    weekAnchorDate,
    setYM,
    setWeekAnchorDate,
  });

  const panRef = useRef<any>(null);

  const {
    gridH,
    gridAnimatedStyle,
    verticalProgress,
    verticalPhase,
    isDragPreviewRef,
    verticalGesture,
    handleToggleViewMode,
  } = useVerticalTransition({
    viewMode,
    setViewMode,
    setYM,
    setWeekAnchorDate,
    selectedDate,
    weekAnchorDate,
    today,
    panRef,
  });

  /** 모드 변경 시 가로 페이저 이동 + 그리드 높이 스냅
   *  ⚠️ 주→월 드래그 프리뷰 중(isDragPreviewRef.current)에는 자동 스냅 생략
   */
  useEffect(() => {
    const idx =
      viewMode === 'month'
        ? monthCenterIndexRef.current
        : weekCenterIndexRef.current;
    requestScroll(idx, false);

    if (viewMode === 'month') {
      if (isDragPreviewRef.current) {
        gridH.value = WEEK_GRID_H; // 프리뷰 시작 직후 높이는 주 높이에서 시작
      } else {
        gridH.value = withTiming(MONTH_GRID_H, {
          duration: SNAP_DUR,
          easing: SNAP_EASING,
        });
      }
    } else {
      gridH.value = withTiming(WEEK_GRID_H, {
        duration: SNAP_DUR,
        easing: SNAP_EASING,
      });
      setTimeout(() => {
        verticalProgress.value = 0;
      }, 0);
    }
  }, [
    viewMode,
    requestScroll,
    gridH,
    verticalProgress,
    isDragPreviewRef,
    monthCenterIndexRef,
    weekCenterIndexRef,
  ]);

  const handleSelectDate = useCallback(
    (date: Date) => {
      setSelectedDate(date);
      if (viewMode === 'week') setWeekAnchorDate(date);
    },
    [viewMode],
  );

  const titleLabel = useMemo(() => {
    const dateForTitle =
      viewMode === 'week'
        ? weekStartSunday(weekAnchorDate)
        : new Date(year, monthIndex, 1);
    return formatTitle(dateForTitle);
  }, [viewMode, weekAnchorDate, year, monthIndex]);

  /** 부모 한 곳만 레이아웃 트랜지션 → 하단이 자연스럽게 따라옴 */
  const LAYOUT = useMemo(
    () => LinearTransition.duration(SNAP_DUR).easing(SNAP_EASING),
    [],
  );

  return (
    <GestureDetector gesture={verticalGesture}>
      <Animated.View
        layout={LAYOUT}
        collapsable={false}
        style={styles.container}
      >
        <Calendar
          titleLabel={titleLabel}
          viewMode={viewMode}
          today={today}
          selectedDate={selectedDate}
          weekAnchorDate={weekAnchorDate}
          onSelectDate={handleSelectDate}
          onToggleViewMode={handleToggleViewMode}
          onPressPrevMonth={onPressPrev}
          onPressNextMonth={onPressNext}
          pages={pages}
          currentIndex={currentIndex}
          onPageMomentumEnd={handlePageMomentumEnd}
          scrollTo={scrollReq || undefined}
          gestureRef={panRef}
          // 상단에서 만든 스타일만 전달(중복 훅 호출 제거)
          gridAnimatedStyle={gridAnimatedStyle}
          verticalPhase={verticalPhase}
          verticalProgress={verticalProgress}
        />
        <DailyRecordTabs />
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
