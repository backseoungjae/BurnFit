# BurnFit Front-end (React Native)

> 캘린더 월/주 전환과 제스처 기반 UI를 중심으로 구현한 과제 저장소입니다.  
> 과제 상세: [Notion 링크](https://bunnit.notion.site/BurnFit-Front-end-20e8af48937680a798ebc5e2f3d1d1e1)

---

## 목차
- [주요 기능](#주요-기능)
- [기술 스택](#기술-스택)
- [프로젝트 구조](#프로젝트-구조)
- [아키텍처/폴더링 원칙](#아키텍처폴더링-원칙)
- [성능 최적화 포인트](#성능-최적화-포인트)

---

## 데모
> 아래 경로에 스크린샷/GIF를 추가해 주세요.
- `docs/calendar-month-to-week.gif` — 월 → 주 전환
- `docs/calendar-week-to-month.gif` — 주 → 월 전환
- `docs/screens.png` — 주요 화면

> 예시(이미지 넣은 뒤 주석 삭제)
>
> ![Month to Week](docs/calendar-month-to-week.gif)
> ![Week to Month](docs/calendar-week-to-month.gif)

---

## 주요 기능
- **캘린더 월/주 전환**
  - 세로 드래그 제스처로 월 ↔ 주 변환
  - 임계 거리/속도 기반 스냅 애니메이션
  - 선택된 주(Row)는 전환 중 **항상 가시성 유지**(opacity 1)
- **수평 무한 페이징**
  - 월/주 단위 페이지 이동 (`FlatList`)
  - `getItemLayout`, `initialScrollIndex` 기반 성능 최적화
- **전환 동기화**
  - 월→주: 비선택 행은 페이드아웃, 선택 주는 상단으로 스무스하게 도착
  - 주→월: 래퍼 `translateY` 역이동으로 자연스러운 확장
- **하단 패널 연동**
  - `DailyRecordTabs`와 전환 진행도(progress) 동기화

---

## 기술 스택
- **React Native (CLI)**
- **TypeScript**
- **react-native-reanimated v3** (애니메이션)
- **react-native-gesture-handler** (제스처)
- **react-native-vector-icons** (아이콘)
- 자체 훅/유틸 기반 상태/로직 분리

---

## 프로젝트 구조
> 기능(Feature) 중심 + 공용 레이어 혼합 구조

## 폴더 구조

project-root/
├─ android/
├─ ios/
├─ node_modules/
└─ src/
├─ apis/
├─ app(s)/
├─ assets/
├─ components/
├─ ui/
│ ├─ Button/
│ └─ Layout.tsx
├─ features/
│ ├─ Calendar/
│ │ ├─ components/
│ │ │ ├─ DayCell.tsx
│ │ │ ├─ PageGrid.tsx
│ │ │ └─ RowAnimated.tsx
│ │ ├─ hooks/
│ │ │ ├─ useInfinitePager.ts
│ │ │ └─ useVerticalTransition.ts
│ │ ├─ calendar.constants.ts
│ │ ├─ calendar.types.ts
│ │ ├─ calendarUtils.ts
│ │ ├─ Calendar.tsx
│ │ ├─ CalendarContainer.tsx
│ │ └─ DailyRecordTabs.tsx
│ ├─ Home/
│ │ ├─ Home.tsx
│ │ └─ HomeContainer.tsx
│ ├─ Library/
│ │ ├─ Library.tsx
│ │ └─ LibraryContainer.tsx
│ └─ Mypage/
│ ├─ Mypage.tsx
│ └─ MypageContainer.tsx
├─ navigation/
│ └─ RootTabNavigator.tsx
├─ screens/
│ ├─ CalendarScreen.tsx
│ ├─ HomeScreen.tsx
│ ├─ LibraryScreen.tsx
│ └─ MypageScreen.tsx
├─ store/
├─ styles/
│ └─ global.ts
├─ types/
├─ utils/

---

## 아키텍처/폴더링 원칙
- **기능 응집**: `features/Calendar` 내부에 컴포넌트/훅/상수/타입을 **colocate**
- **공용 레이어 분리**: 재사용 가능한 UI는 `ui/`, 범용 유틸은 `utils/`
- **Public API 노출**: 기능 루트에 `index.ts` 배치하여 외부 공개 범위 제한(선택)
- **경로 별칭(권장)**: `@features/*`, `@ui/*`, `@utils/*`, `@screens/*`
---

### 의존성 설치
```bash
# 패키지 설치
yarn            # 또는 npm i

# iOS pod 설치
cd ios && pod install && cd ..

# iOS
npx react-native run-ios

# Android
npx react-native run-android

현재 필수 .env는 없습니다. 필요 시 아래 형식 예시를 참고하세요.

성능 최적화 포인트

재사용 가능한 상수/유틸 모듈화
FlatList 가시성 범위 최소화 및 key 안정화
불필요한 상태 전파/전역 상태 남용 지양(가능하면 기능 내부로 한정)

FlatList 가시성 범위 최소화 및 key 안정화

불필요한 상태 전파/전역 상태 남용 지양(가능하면 기능 내부로 한정)
