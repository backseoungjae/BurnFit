/**
 * @file RowAnimated.tsx
 * @description 캘린더 그리드의 한 행(일주일)을 렌더링하며, 월/주 전환 애니메이션을 담당하는 컴포넌트입니다.
 *
 * @description
 * 월 뷰에서 주 뷰로 전환될 때, 선택되지 않은 행들은 위로 올라가며 사라지는(fade-out & lift) 애니메이션을 적용합니다.
 * 반대로 주 뷰에서 월 뷰로 전환될 때는, 숨겨져 있던 행들이 아래로 내려오며 나타나는(fade-in & drop) 애니메이션을 적용합니다.
 */
import React from 'react';
import { StyleSheet } from 'react-native';
import Animated, { Easing, useAnimatedStyle } from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';

import { ROW_GAP } from '../calendarConstants';

type RowAnimatedProps = {
  children: React.ReactNode;
  rowIndex: number;
  selectedRowIndex: number;
  verticalPhase?: 'idle' | 'toWeek' | 'toMonth';
  verticalProgress?: SharedValue<number>;
};

export function RowAnimated({
  children,
  rowIndex,
  selectedRowIndex,
  verticalPhase,
  verticalProgress,
}: RowAnimatedProps) {
  const style = useAnimatedStyle(() => {
    const p = Math.min(Math.max(verticalProgress?.value ?? 0, 0), 1);
    const eased = Easing.out(Easing.cubic)(p);
    const isSelected = rowIndex === selectedRowIndex && selectedRowIndex >= 0;

    if (verticalPhase === 'toWeek') {
      if (isSelected) {
        return { opacity: 1, transform: [{ translateY: 0 }] };
      }
      const LIFT_PX = 10;
      return {
        opacity: 1 - eased,
        transform: [{ translateY: -LIFT_PX * eased }],
      };
    }

    if (verticalPhase === 'toMonth') {
      if (isSelected) {
        return { opacity: 1, transform: [{ translateY: 0 }] };
      }
      const DROP_PX = 10;
      return {
        opacity: eased,
        transform: [{ translateY: -DROP_PX * (1 - eased) }],
      };
    }

    return { opacity: 1, transform: [{ translateY: 0 }] };
  });

  return (
    <Animated.View
      style={[
        styles.row,
        rowIndex > 0 ? styles.rowVGap : undefined,
        rowIndex === selectedRowIndex ? styles.selectedRow : styles.normalRow,
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {},
  rowVGap: { marginTop: ROW_GAP },
  selectedRow: {
    zIndex: 3,
    elevation: 3,
  },
  normalRow: {
    zIndex: 1,
    elevation: 1,
  },
});
