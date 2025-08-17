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
