/**
 * @file PageGrid.tsx
 * @description 캘린더의 한 페이지(한 달 또는 한 주)에 해당하는 날짜 그리드를 렌더링하는 컴포넌트입니다.
 *
 * @description
 * `page.days` 배열을 받아 7일씩 묶어 여러 개의 `RowAnimated` 컴포넌트로 렌더링합니다.
 * 월/주 전환 시, 전체 그리드의 수직 위치를 조정하는 애니메이션(contentLiftStyle)을 담당하여
 * 선택된 주가 제자리에 머무는 듯한 효과를 구현합니다.
 */
import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle } from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';

import {
  CELL_SIDE,
  COL_GAP,
  ROW_GAP,
  SCREEN_WIDTH,
} from '../calendarConstants';
import type { PageData } from '../calendarTypes';
import { isSameDay } from '../calendarUtils';
import { DayCell } from './DayCell';
import { RowAnimated } from './RowAnimated';

type PageGridProps = {
  page: PageData;
  viewMode: 'month' | 'week';
  today: Date | null;
  selectedDate: Date | null;
  weekAnchorDate: Date;
  onSelectDate: (d: Date) => void;
  verticalPhase?: 'idle' | 'toWeek' | 'toMonth';
  verticalProgress?: SharedValue<number>;
};

export function PageGrid({
  page,
  selectedDate,
  weekAnchorDate,
  verticalPhase,
  verticalProgress,
  onSelectDate,
  today,
  viewMode,
}: PageGridProps) {
  const rows = useMemo(() => {
    const out: Date[][] = [];
    for (let i = 0; i < page.days.length; i += 7) {
      out.push(page.days.slice(i, i + 7));
    }
    return out;
  }, [page.days]);

  const anchorForRow: Date | null =
    verticalPhase === 'toMonth' ? weekAnchorDate : selectedDate;

  const selectedRowIndex = useMemo(() => {
    return rows.findIndex(week => week.some(d => isSameDay(d, anchorForRow)));
  }, [rows, anchorForRow]);

  const contentLiftStyle = useAnimatedStyle(() => {
    if (selectedRowIndex < 0) return { transform: [{ translateY: 0 }] };
    const p = Math.min(Math.max(verticalProgress?.value ?? 0, 0), 1);
    const eased = Easing.out(Easing.cubic)(p);
    const rowHeight = CELL_SIDE + ROW_GAP;
    const yTop = selectedRowIndex * rowHeight;

    if (verticalPhase === 'toWeek') {
      return { transform: [{ translateY: -yTop * eased }] };
    }
    if (verticalPhase === 'toMonth') {
      return { transform: [{ translateY: -yTop * (1 - eased) }] };
    }
    return { transform: [{ translateY: 0 }] };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={contentLiftStyle}>
        {rows.map((week, rowIdx) => (
          <RowAnimated
            key={`row-${rowIdx}`}
            rowIndex={rowIdx}
            selectedRowIndex={selectedRowIndex}
            verticalPhase={verticalPhase}
            verticalProgress={verticalProgress}
          >
            <View style={styles.rowInner}>
              {week.map(d => (
                <DayCell
                  key={String(d.getTime())}
                  date={d}
                  pageMonthIndex={page.monthIndex}
                  today={today}
                  selectedDate={selectedDate}
                  viewMode={viewMode}
                  onSelectDate={onSelectDate}
                />
              ))}
            </View>
          </RowAnimated>
        ))}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    paddingHorizontal: 16,
  },
  rowInner: {
    flexDirection: 'row',
    columnGap: COL_GAP,
  },
});
