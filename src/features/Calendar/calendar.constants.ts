/**
 * @file calendar.constants.ts
 * @description 캘린더 기능 전반에서 사용되는 공유 상수 파일입니다.
 *
 * @description
 * UI 레이아웃 계산에 필요한 값들(e.g., 화면 너비, 셀 크기, 그리드 높이)을 상수로 정의하여
 * 여러 컴포넌트에서 일관된 스타일을 유지하고, 값의 변경이 필요할 때 한 곳에서 관리할 수 있도록 합니다.
 */
// 공용 레이아웃 상수 + 타입
import { Dimensions } from 'react-native';

export const SCREEN_WIDTH = Dimensions.get('window').width;
export const H_PADDING = 16 * 2;
export const COL_GAP = 8;
export const ROW_GAP = 6;
export const CELL_SIDE = (SCREEN_WIDTH - H_PADDING - COL_GAP * 6) / 7;

export const MONTH_ROWS = 6;
export const MONTH_GRID_H = CELL_SIDE * MONTH_ROWS + ROW_GAP * (MONTH_ROWS - 1);
export const WEEK_GRID_H = CELL_SIDE;
