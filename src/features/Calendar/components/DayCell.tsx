/**
 * @file DayCell.tsx
 * @description 캘린더 그리드의 개별 날짜 하나를 렌더링하는 컴포넌트입니다.
 *
 * @description
 * 날짜 숫자를 표시하며, 선택된 날짜, 오늘 날짜, 현재 월에 속하지 않는 날짜 등
 * 다양한 상태에 따라 다른 스타일(e.g., 원 표시, 글자색 변경)을 적용합니다.
 * `React.memo`를 사용하여 불필요한 리렌더링을 방지하는 성능 최적화가 적용되어 있습니다.
 */
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { CELL_SIDE } from '../calendarConstants';
import { isSameDay } from '../calendarUtils';

const CIRCLE_SIDE = Math.floor(CELL_SIDE * 0.88);

type DayCellProps = {
  date: Date;
  pageMonthIndex: number;
  today: Date | null;
  selectedDate: Date | null;
  viewMode: 'month' | 'week';
  onSelectDate: (d: Date) => void;
};

export const DayCell = React.memo(
  ({
    date,
    pageMonthIndex,
    selectedDate,
    viewMode,
    onSelectDate,
  }: DayCellProps) => {
    const inCurrentMonth = date.getMonth() === pageMonthIndex;
    const isSelected = isSameDay(date, selectedDate);
    const dayTextStyle = [
      styles.dayText,
      viewMode === 'month' && !inCurrentMonth
        ? styles.outsideMonthText
        : undefined,
      isSelected ? styles.selectedText : undefined,
    ];
    const circleStyle = [
      styles.dayCircle,
      isSelected ? styles.selectedCircle : undefined,
    ];
    return (
      <TouchableOpacity style={styles.cell} onPress={() => onSelectDate(date)}>
        <View style={circleStyle as any}>
          <Text style={dayTextStyle as any}>{date.getDate()}</Text>
        </View>
      </TouchableOpacity>
    );
  },
);

const styles = StyleSheet.create({
  cell: {
    width: CELL_SIDE,
    height: CELL_SIDE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCircle: {
    width: CIRCLE_SIDE,
    height: CIRCLE_SIDE,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: CIRCLE_SIDE / 2,
  },
  selectedCircle: { backgroundColor: '#698da9', borderRadius: CIRCLE_SIDE / 2 },
  dayText: { fontSize: 15, color: '#000' },
  selectedText: { color: '#fff', fontWeight: '700' },
  outsideMonthText: { color: '#d1d1d6' },
});
