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
