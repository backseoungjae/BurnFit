/**
 * @file Calendar.tsx
 * @description 캘린더의 전체적인 UI 구조를 담당하는 순수 뷰 컴포넌트입니다.
 *
 * @property {Component} PageGrid - 한 페이지(월/주)의 날짜 그리드를 렌더링하는 컴포넌트
 *
 * @description
 * 이 컴포넌트는 자체적인 상태나 비즈니스 로직을 가지지 않습니다.
 * 모든 데이터와 이벤트 핸들러는 `CalendarContainer`로부터 props로 전달받아 UI를 렌더링하는 역할만 수행합니다.
 * 캘린더의 헤더(월, 이전/다음 버튼), 요일 표시줄, 그리고 `FlatList`를 이용한 가로 페이징 그리드를 포함합니다.
 */
import React, { useEffect, useMemo, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FlatList as GHFlatList } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

import { SCREEN_WIDTH } from './calendarConstants';
import type { CalendarProps, PageData } from './calendarTypes';
import { PageGrid } from './components/PageGrid';

export default function Calendar({
  titleLabel,
  viewMode,
  today,
  selectedDate,
  weekAnchorDate,
  onSelectDate,
  onToggleViewMode,
  onPressPrevMonth,
  onPressNextMonth,
  pages,
  currentIndex,
  onPageMomentumEnd,
  scrollTo,
  gestureRef,
  gridAnimatedStyle,
  verticalPhase,
  verticalProgress,
}: CalendarProps) {
  const modeKey = viewMode;
  const initialOffsetX = useMemo(
    () => SCREEN_WIDTH * currentIndex,
    [currentIndex],
  );

  const pagerRef = useRef<GHFlatList<PageData>>(null);
  useEffect(() => {
    if (!scrollTo) return;
    pagerRef.current?.scrollToIndex({
      index: scrollTo.index,
      animated: scrollTo.animated,
    });
  }, [scrollTo]);

  const getItemLayout = useMemo(
    () => (_: unknown, index: number) => ({
      length: SCREEN_WIDTH,
      offset: SCREEN_WIDTH * index,
      index,
    }),
    [],
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onPressPrevMonth}
          hitSlop={8}
          style={styles.navBtn}
        >
          <Text style={styles.navText}>‹</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onToggleViewMode} activeOpacity={0.7}>
          <Text style={styles.headerTitle}>{titleLabel}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onPressNextMonth}
          hitSlop={8}
          style={styles.navBtn}
        >
          <Text style={styles.navText}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Weekday Row */}
      <View style={styles.weekHeaderRow}>
        {['일', '월', '화', '수', '목', '금', '토'].map((label, idx) => (
          <View key={label} style={styles.weekHeaderCell}>
            <Text
              style={[
                styles.weekHeaderText,
                idx === 0 ? styles.sunday : undefined,
                idx === 6 ? styles.saturday : undefined,
              ]}
            >
              {label}
            </Text>
          </View>
        ))}
      </View>

      {/* 날짜 그리드 페이저 — 높이는 외부 애니메이션 */}
      <Animated.View style={gridAnimatedStyle}>
        <GHFlatList<PageData>
          key={modeKey}
          ref={pagerRef}
          horizontal
          pagingEnabled
          data={pages}
          keyExtractor={p => p.key}
          renderItem={({ item }) => (
            <PageGrid
              page={item}
              viewMode={viewMode}
              today={today}
              selectedDate={selectedDate}
              weekAnchorDate={weekAnchorDate}
              onSelectDate={onSelectDate}
              verticalPhase={verticalPhase}
              verticalProgress={verticalProgress}
            />
          )}
          showsHorizontalScrollIndicator={false}
          initialScrollIndex={currentIndex}
          contentOffset={{ x: initialOffsetX, y: 0 }}
          getItemLayout={getItemLayout}
          removeClippedSubviews={false}
          onMomentumScrollEnd={e => {
            const idx = Math.round(
              e.nativeEvent.contentOffset.x / SCREEN_WIDTH,
            );
            onPageMomentumEnd?.(idx);
          }}
          windowSize={3}
          initialNumToRender={1}
          maxToRenderPerBatch={3}
          onScrollToIndexFailed={({ index }) => {
            setTimeout(() => {
              pagerRef.current?.scrollToIndex({ index, animated: false });
            }, 0);
          }}
          simultaneousHandlers={gestureRef}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#fff', paddingTop: 16 },
  header: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#000' },
  navBtn: { padding: 8 },
  navText: { fontSize: 32, color: '#73dae9' },
  weekHeaderRow: {
    flexDirection: 'row',
    marginBottom: 6,
    paddingHorizontal: 16,
  },
  weekHeaderCell: { flex: 1, alignItems: 'center' },
  weekHeaderText: { fontSize: 12, color: '#000' },
  sunday: { color: '#C62828' },
  saturday: { color: '#1565C0' },
});
