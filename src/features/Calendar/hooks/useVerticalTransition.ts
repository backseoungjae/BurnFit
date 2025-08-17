/**
 * @file useVerticalTransition.ts
 * @description 캘린더의 월/주 뷰 간의 수직 전환 제스처 및 애니메이션 로직을 관리하는 커스텀 훅입니다.
 *
 * @description
 * `react-native-gesture-handler`의 Pan Gesture를 사용하여 사용자의 상하 드래그 제스처를 감지합니다.
 * 제스처에 따라 `react-native-reanimated`를 사용하여 캘린더 그리드의 높이를 부드럽게 변경하는 애니메이션을 제어합니다.
 * 헤더의 월/년을 탭했을 때 프로그래매틱하게 뷰를 전환하는 핸들러(`handleToggleViewMode`)도 제공합니다.
 */
import { useCallback, useMemo, useRef, useState } from 'react';
import { Gesture } from 'react-native-gesture-handler';
import {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import type { ViewMode } from '../calendarTypes';
import { MONTH_GRID_H, WEEK_GRID_H } from '../calendarConstants';
import { getYearMonthFrom } from '../calendarUtils';

const DRAG_RANGE = 180;
const TOGGLE_VELOCITY = 900;
const SNAP_DUR = 220;
const SNAP_EASING = Easing.out(Easing.cubic);

const V_INTENT_FACTOR = 1.15;
const V_START = 12;

type UseVerticalTransitionProps = {
  viewMode: ViewMode;
  setViewMode: React.Dispatch<React.SetStateAction<ViewMode>>;
  setYM: React.Dispatch<
    React.SetStateAction<{ year: number; monthIndex: number }>
  >;
  setWeekAnchorDate: React.Dispatch<React.SetStateAction<Date>>;
  selectedDate: Date | null;
  weekAnchorDate: Date;
  today: Date;
  panRef: React.RefObject<any>;
};

export function useVerticalTransition({
  viewMode,
  setViewMode,
  setYM,
  setWeekAnchorDate,
  selectedDate,
  weekAnchorDate,
  today,
  panRef,
}: UseVerticalTransitionProps) {
  const gridH = useSharedValue(MONTH_GRID_H);
  const dragStartH = useSharedValue(MONTH_GRID_H);
  const gridAnimatedStyle = useAnimatedStyle(() => ({ height: gridH.value }));

  const verticalProgress = useSharedValue(0);
  const [verticalPhase, setVerticalPhase] = useState<
    'idle' | 'toWeek' | 'toMonth'
  >('idle');

  const isDragPreviewRef = useRef(false);
  const previewStarted = useSharedValue(0);

  const switchToWeek = useCallback(() => {
    setWeekAnchorDate(prev => selectedDate ?? prev ?? today);
    setViewMode('week');
  }, [selectedDate, today, setViewMode, setWeekAnchorDate]);

  const switchToMonth = useCallback(() => {
    const ym = getYearMonthFrom(weekAnchorDate);
    setYM(ym);
    setViewMode('month');
  }, [weekAnchorDate, setYM, setViewMode]);

  const beginToMonthPreview = useCallback(() => {
    isDragPreviewRef.current = true;
    setVerticalPhase('toMonth');
    switchToMonth();
  }, [switchToMonth]);

  const endDragPreview = useCallback(() => {
    isDragPreviewRef.current = false;
  }, []);

  const deferSetIdle = useCallback(() => {
    setTimeout(() => setVerticalPhase('idle'), 0);
  }, []);

  const verticalGesture = useMemo(() => {
    return Gesture.Pan()
      .withRef(panRef)
      .minDistance(6)
      .failOffsetX([-16, 16])
      .activeOffsetY([-V_START, V_START])
      .onBegin(() => {
        dragStartH.value = gridH.value;
        previewStarted.value = 0;
        runOnJS(setVerticalPhase)('idle');
        verticalProgress.value = 0;
      })
      .onUpdate(e => {
        'worklet';
        const vy = e.translationY;
        const vx = e.translationX;
        const verticalDominant = Math.abs(vy) > Math.abs(vx) * V_INTENT_FACTOR;
        const toWeekGate = -vy > V_START && verticalDominant;
        const toMonthGate = vy > V_START && verticalDominant;

        if (dragStartH.value === MONTH_GRID_H) {
          if (previewStarted.value === 0) {
            if (toWeekGate) {
              previewStarted.value = 1;
              runOnJS(setVerticalPhase)('toWeek');
            } else return;
          }
          const p = Math.max(0, Math.min(1, -vy / DRAG_RANGE));
          gridH.value = MONTH_GRID_H + (WEEK_GRID_H - MONTH_GRID_H) * p;
          verticalProgress.value = p;
          return;
        }

        if (dragStartH.value === WEEK_GRID_H) {
          if (previewStarted.value === 0) {
            if (toMonthGate) {
              previewStarted.value = 1;
              runOnJS(beginToMonthPreview)();
            } else return;
          }
          const p = Math.max(0, Math.min(1, vy / DRAG_RANGE));
          gridH.value = WEEK_GRID_H + (MONTH_GRID_H - WEEK_GRID_H) * p;
          verticalProgress.value = p;
        }
      })
      .onEnd(e => {
        'worklet';
        if (dragStartH.value === MONTH_GRID_H) {
          const started = previewStarted.value === 1;
          const commit =
            started &&
            (-e.translationY > DRAG_RANGE * 0.35 ||
              e.velocityY < -TOGGLE_VELOCITY);

          if (commit) {
            verticalProgress.value = withTiming(1, {
              duration: SNAP_DUR,
              easing: SNAP_EASING,
            });
            gridH.value = withTiming(
              WEEK_GRID_H,
              { duration: SNAP_DUR, easing: SNAP_EASING },
              finished => {
                if (finished) {
                  runOnJS(switchToWeek)();
                  runOnJS(deferSetIdle)();
                }
              },
            );
          } else {
            verticalProgress.value = withTiming(0, {
              duration: SNAP_DUR,
              easing: SNAP_EASING,
            });
            gridH.value = withTiming(MONTH_GRID_H, {
              duration: SNAP_DUR,
              easing: SNAP_EASING,
            });
            runOnJS(deferSetIdle)();
          }
          return;
        }

        const started = previewStarted.value === 1;
        const commit =
          started &&
          (e.translationY > DRAG_RANGE * 0.35 ||
            e.velocityY > TOGGLE_VELOCITY ||
            verticalProgress.value > 0.5);

        if (commit) {
          verticalProgress.value = withTiming(1, {
            duration: SNAP_DUR,
            easing: SNAP_EASING,
          });
          gridH.value = withTiming(
            MONTH_GRID_H,
            { duration: SNAP_DUR, easing: SNAP_EASING },
            finished => {
              if (finished) {
                runOnJS(endDragPreview)();
                runOnJS(deferSetIdle)();
              }
            },
          );
        } else {
          verticalProgress.value = withTiming(0, {
            duration: SNAP_DUR,
            easing: SNAP_EASING,
          });
          gridH.value = withTiming(
            WEEK_GRID_H,
            { duration: SNAP_DUR, easing: SNAP_EASING },
            finished => {
              if (finished && started) {
                runOnJS(setViewMode)('week');
                runOnJS(endDragPreview)();
              }
              runOnJS(deferSetIdle)();
            },
          );
        }
      });
  }, [
    dragStartH,
    gridH,
    verticalProgress,
    beginToMonthPreview,
    endDragPreview,
    switchToWeek,
    deferSetIdle,
    panRef,
    setViewMode,
  ]);

  const handleToggleViewMode = useCallback(() => {
    if (viewMode === 'month') {
      setVerticalPhase('toWeek');
      verticalProgress.value = withTiming(1, {
        duration: SNAP_DUR,
        easing: SNAP_EASING,
      });
      gridH.value = withTiming(
        WEEK_GRID_H,
        { duration: SNAP_DUR, easing: SNAP_EASING },
        f => {
          if (f) {
            runOnJS(switchToWeek)();
            runOnJS(setVerticalPhase)('idle');
            verticalProgress.value = 0;
          }
        },
      );
    } else {
      isDragPreviewRef.current = true;
      setVerticalPhase('toMonth');
      switchToMonth();
      verticalProgress.value = withTiming(1, {
        duration: SNAP_DUR,
        easing: SNAP_EASING,
      });
      gridH.value = withTiming(
        MONTH_GRID_H,
        { duration: SNAP_DUR, easing: SNAP_EASING },
        () => {
          isDragPreviewRef.current = false;
          runOnJS(setVerticalPhase)('idle');
        },
      );
    }
  }, [viewMode, gridH, verticalProgress, switchToWeek, switchToMonth]);

  return {
    gridH,
    gridAnimatedStyle,
    verticalProgress,
    verticalPhase,
    isDragPreviewRef,
    verticalGesture,
    handleToggleViewMode,
  };
}
