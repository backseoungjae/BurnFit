/**
 * @file calendar.types.ts
 * @description 캘린더 기능 전반에서 사용되는 TypeScript 타입 정의 파일입니다.
 *
 * @description
 * `CalendarProps`, `PageData` 등 여러 컴포넌트와 훅에서 공통으로 사용하는 타입들을 모아 관리하여
 * 타입의 일관성을 유지하고 재사용성을 높입니다.
 */
import type { SharedValue } from 'react-native-reanimated';

export type ViewMode = 'month' | 'week';
export type YearMonth = { year: number; monthIndex: number };
export type PageData = { key: string; days: Date[]; monthIndex: number };

export type CalendarProps = {
  titleLabel: string;
  viewMode: 'month' | 'week';
  today: Date | null;
  selectedDate: Date | null;
  /** 현재 보고 있는 주의 기준 날짜(주→월 전환 시 행 판정에 사용) */
  weekAnchorDate: Date;
  onSelectDate: (date: Date) => void;
  onToggleViewMode?: () => void;
  onPressPrevMonth: () => void;
  onPressNextMonth: () => void;
  pages: PageData[];
  currentIndex: number;
  onPageMomentumEnd: (nextIndex: number) => void;
  scrollTo?: { index: number; animated: boolean; seq: number };
  /** 수직 Pan 제스처 ref (동시 인식용) */
  gestureRef?: React.RefObject<any>;
  /** 날짜 그리드(페이저) 높이 애니메이션 스타일 */
  gridAnimatedStyle?: any;
  /** 월↔주 전환 제어 */
  verticalPhase?: 'idle' | 'toWeek' | 'toMonth';
  verticalProgress?: SharedValue<number>;
};
