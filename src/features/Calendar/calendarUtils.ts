/**
 * @file calendarUtils.ts
 * @description 날짜 관련 순수 함수들을 모아놓은 유틸리티 파일입니다.
 *
 * @description
 * 특정 상태에 의존하지 않고, 입력값이 같으면 항상 같은 출력값을 반환하는 순수 함수들로 구성됩니다.
 * (e.g., `buildMonthMatrix`, `isSameDay`)
 * 이를 통해 날짜 계산 및 조작 로직을 재사용하고, 비즈니스 로직과 분리하여 관리합니다.
 */
import { YearMonth } from './calendar.types';

export function getYearMonthFrom(date: Date): YearMonth {
  return { year: date.getFullYear(), monthIndex: date.getMonth() };
}

export function buildMonthMatrix(year: number, monthIndex: number): Date[] {
  const firstDayOfMonth = new Date(year, monthIndex, 1);
  const firstWeekday = firstDayOfMonth.getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const totalCells = Math.ceil((firstWeekday + daysInMonth) / 7) * 7;
  const cells: Date[] = [];
  for (let i = 0; i < totalCells; i += 1) {
    const dayNumber = i - firstWeekday + 1;
    cells.push(new Date(year, monthIndex, dayNumber));
  }
  return cells;
}

export function weekStartSunday(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  x.setDate(x.getDate() - x.getDay());
  return x;
}

export function buildWeekDays(weekStart: Date) {
  const start = new Date(weekStart);
  start.setHours(0, 0, 0, 0);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    return d;
  });
}

export function formatTitle(date: Date) {
  const monthLabel = date.toLocaleString('ko-KR', { month: 'long' });
  return `${date.getFullYear()}년 ${monthLabel}`;
}

export function isSameDay(a: Date | null, b: Date | null) {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
