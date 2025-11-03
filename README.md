# '언제봐' (WhenToMeet)

## 스마트 스터디/팀 프로젝트 일정 매칭 웹앱

복잡한 일정 조율은 그만! 모두가 가능한 최적의 시간과 장소를 자동으로 찾아주는 협업 플랫폼.

## 프로젝트 개요

'언제봐'는 팀 프로젝트, 스터디 그룹 등 다수 인원의 일정 조율 과정에서 발생하는 비효율성을 해결하기 위해 개발되었습니다. 사용자가 자신의 가용 시간을 입력하면, 시스템이 **실시간으로 모든 팀원의 교집합 시간대(최적 시간)**를 계산하고 시각화하여 보여줍니다.

또한, 단순 시간 조율을 넘어 **공간 인식형 매칭**과 '액션 아이템 체크리스트' 등의 기능을 제공하여, 모임 준비부터 실행까지 전 과정을 지원합니다.

## 파일 구조

```java
src/
├── assets/                 # 이미지, 아이콘, 폰트 등 정적 자원
│   ├── images/
│   └── fonts/
├── components/             # ⭐️ 재사용 가능한 UI 컴포넌트
│   ├── common/             # Button, Input, Modal, Header 등 범용 컴포넌트
│   │   ├── Button.jsx
│   │   └── Modal.jsx
│   ├── specific/           # 프로젝트 특정 컴포넌트 (룰렛, 체크리스트 카드 등)
│   │   ├── TimeGrid/       # 캘린더 UI 관련 컴포넌트
│   │   ├── TimeRoulette.jsx# 타임룰렛 컴포넌트 (Framer Motion)
│   │   └── ChecklistItem.jsx
├── config/                 # 설정 파일
│   ├── firebase.js         # Firebase SDK 초기화 및 설정 (API Key 등)
│   └── routes.jsx          # react-router-dom 라우팅 정의
├── hooks/                  # 커스텀 훅 (ex: useAuth, useGroupData)
│   └── useAuth.js          # Firebase Auth 관련 로직 훅
├── pages/                  # 라우팅 되는 페이지 컴포넌트
│   ├── AuthPage.jsx        # 로그인/회원가입
│   ├── GroupListPage.jsx   # 그룹 목록
│   ├── GroupDetailPage/    # 그룹 상세 페이지 폴더 (캘린더, 사이드바 포함)
│   │   ├── GroupDetail.jsx
│   │   └── components/     # 페이지 내에서만 사용되는 컴포넌트
│   ├── HistoryPage.jsx     # 모임 이력 카드 페이지
│   └── LocationMatchPage.jsx # 공간 인식형 매칭 페이지
├── stores/                 # ⭐️ 상태 관리 (Zustand) 폴더
│   ├── userStore.js        # 사용자 정보, 인증 상태
│   └── groupStore.js       # 현재 그룹, 선택된 시간 등 그룹 관련 상태
├── styles/                 # Tailwind를 보조하는 글로벌 스타일
│   ├── index.css           # Tailwind base, components, utilities import
│   └── GlobalStyles.js     # Emotion/Styled-components 대안 또는 JS 내 스타일
├── utils/                  # 순수 JavaScript 함수
│   ├── dateUtils.js        # dayjs를 활용한 날짜/시간 포맷팅
│   └── locationUtils.js    # 위치 데이터 좌표 변환 등 지도 관련 로직 (카카오/네이버)
└── App.jsx                 # 최상위 앱 컴포넌트
```

## 참고!

# React의 일반적인 폴더 구조

React 프로젝트는 **파일을 어떻게 나누느냐**에 따라 협업 효율과 유지보수성이 크게 달라져요.

아래는 많은 프로젝트에서 참고하는 기본 구조에요.

```
src/
 ┣ assets/
 ┣ components/
 ┣ pages/
 ┣ hooks/
 ┣ context/
 ┣ utils/
 ┣ types/
 ┣ apis/
 ┣ App.tsx
 ┗ main.tsx
```

---

## 1) assets/ (정적 파일)

이미지, 아이콘, CSS 같은 정적 자산을 넣어요.

```
src/assets/logo.png
src/assets/global.css
```

---

## 2) components/ (공용 컴포넌트)

재사용 가능한 작은 단위 UI 컴포넌트를 모아둬요.

```
src/components/Button.tsx
src/components/Modal.tsx
```

---

## 3) pages/ (페이지 단위 컴포넌트)

라우팅과 연결되는 큰 화면 컴포넌트에요.

```
src/pages/Login.tsx
src/pages/Home.tsx
```

---

## 4) hooks/ (커스텀 훅)

재사용 가능한 로직을 함수로 묶어둔 폴더에요.

```
src/hooks/useAuth.ts
src/hooks/useFetch.ts
```

---

## 5) context/ (전역 상태 관리)

Context API로 전역 데이터를 관리해요.

```
src/context/AuthContext.tsx
src/context/ThemeContext.tsx
```

---

## 6) utils/ (유틸 함수 모음)

자주 쓰이는 공통 함수를 넣는 곳이에요.

```
src/utils/date.ts
src/utils/formatter.ts
```

---

## 7) types/ (타입 정의)

TypeScript 프로젝트라면 **타입 정의**를 모아두는 곳이에요.

```
src/types/user.ts
src/types/post.ts
```

👉 여러 컴포넌트나 API에서 공통으로 쓰이는 타입을 관리하기 좋아요.

---

## 8) apis/ (API 요청 관리)

서버와 통신하는 코드(axios, fetch 등)를 모아두는 곳이에요.

```
src/apis/auth.ts     // 로그인, 회원가입 API
src/apis/todo.ts     // ToDo 관련 API
```

👉 API 코드를 따로 두면 **네트워크 요청과 UI 로직을 분리**할 수 있어서 깔끔해져요.

---

## 9) App.tsx

앱의 뼈대(루트 컴포넌트) 역할을 해요.

---

## 10) main.tsx

React 앱의 진짜 시작점이에요

여기서 App.tsx를 DOM에 붙여줘요.
