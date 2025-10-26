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
