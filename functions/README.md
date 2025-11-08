# WebFrameWork – Monorepo (Vite + Firebase)

스마트 모임 웹앱의 **프론트(React/Vite)** + **백엔드(Firebase Functions/Firestore/Hosting)** 가 한 리포에 들어있는 모노레포입니다.

---

## 폴더 구조

```
/
├─ src/                    # React app
├─ public/
├─ dist/                   # Vite build output (자동 생성)
├─ functions/              # Cloud Functions (TypeScript)
│  ├─ src/
│  │  ├─ index.ts          # Express + onRequest(api) 엔트리
│  │  └─ groups.ts         # 그룹 생성/참여 로직
│  ├─ lib/                 # tsc 결과물 (자동 생성)
│  ├─ package.json
│  └─ tsconfig.json
├─ firebase.json           # Hosting/Functions/Emulators 설정 + 리라이트
├─ .firebaserc             # Firebase 프로젝트 alias
├─ package.json            # Frontend scripts
└─ .env                    # Vite 환경변수(로컬)
```

---

## 요구사항

- **Node.js 20** (LTS 권장)  
  `nvm install 20 && nvm use 20`
- **Firebase CLI**  
  `npm i -g firebase-tools` → `firebase login`

> (선택) 에뮬레이터가 Java 21 이상 권고 알림을 띄울 수 있습니다. 필수는 아님.

---

## 설치

```bash
# 리포 클론 후
npm i
cd functions && npm i && cd ..
```

---

## 환경변수(.env)

Firebase 콘솔 → 프로젝트 설정 → Web App SDK 값으로 채움:

```ini
VITE_FB_API_KEY=...
VITE_FB_AUTH_DOMAIN=...
VITE_FB_PROJECT_ID=webframework-dbfc6
VITE_FB_STORAGE_BUCKET=...
VITE_FB_MESSAGING_SENDER_ID=...
VITE_FB_APP_ID=...
```

---

## 스크립트

루트 `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "emulators": "npm run build && firebase emulators:start",
    "deploy": "npm run build && cd functions && npm run build && cd .. && firebase deploy --only functions,hosting"
  }
}
```

`functions/package.json`:

```json
{
  "main": "lib/index.js",
  "engines": { "node": "20" },
  "scripts": {
    "build": "tsc",
    "serve": "npm run build && firebase emulators:start --only functions",
    "deploy": "npm run build && firebase deploy --only functions"
  }
}
```

---

## 로컬 개발

### A) 프론트만 실행(실서버 API 사용 시)

```bash
npm run dev
```

### B) 통합 에뮬레이터(Hosting + Functions + Firestore + Auth)

```bash
npm run build
cd functions && npm run build && cd ..
firebase emulators:start
```

- Hosting: `http://127.0.0.1:5173`  
- Emulator UI: `http://127.0.0.1:4000`  
- Functions: `http://127.0.0.1:5001/webframework-dbfc6/asia-northeast3/api`

> 에뮬레이터 데이터를 유지하려면:  
> `firebase emulators:start --import ./.emuldata --export-on-exit`

---

## API

호스팅 리라이트(`firebase.json`)로 프론트에서 **동일 오리진**으로 호출합니다.

### POST `/api/groups` – 그룹 생성 & 초대코드 발급

**Body**

```json
{
  "name": "알고리즘 스터디",
  "description": "매주 목 7시",
  "basePlaceType": "SCHOOL",
  "baseAddress": "한성대 공학관",
  "baseLatitude": 37.5823,
  "baseLongitude": 127.0096
}
```

**Response**

```json
{ "id": "<groupId>", "inviteCode": "AB12CDEF" }
```

### POST `/api/groups/join` – 초대코드로 참여

**Body**

```json
{ "code": "AB12CDEF", "uid": "<firebaseAuthUid>" }
```

**Response**

```json
{ "id": "<groupId>", "name": "<groupName>" }
```

#### cURL 예시(에뮬레이터)

```bash
curl -X POST http://127.0.0.1:5173/api/groups \
  -H "Content-Type: application/json" \
  -d '{"name":"테스트","basePlaceType":"SCHOOL","baseAddress":"한성대","baseLatitude":37.58,"baseLongitude":127.01}'
```

---

## Firestore 보안 규칙(개발용 간단 버전)

`firestore.rules`

```rules
rules_version = '2';
service cloud.firestore {
  match /databases/{db}/documents {
    match /groups/{groupId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /groups/{groupId}/members/{uid} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```

> 운영 전에는 **생성자만 수정 허용**, 초대코드 재발급 권한, 삭제 권한 등으로 강화 필요.

---

## 검증 방법(현 페이지에서 동작 확인)

1. 브라우저 개발자도구 → **Network** 탭 켠 상태에서 “그룹 만들기” 클릭  
   응답이 **201 + JSON({ id, inviteCode })** 인지 확인  
2. `http://127.0.0.1:4000/firestore` → `groups` 컬렉션에 문서가 생겼는지 확인  
3. 필요 시 `curl` 로 `/api/groups/join` 호출 → `groups/{id}/members/{uid}` 문서 생성 확인

---

## 프로젝트 전환

```bash
firebase use --add     # 새 프로젝트 alias 추가
firebase use <alias>   # 전환
```

---

## 트러블슈팅

- **Cannot POST /api/groups**  
  → `firebase emulators:start`로 Hosting+Functions가 **같이** 떠있는지 확인.  
  루트에서 `npm run build` 후 실행해 `dist`가 서빙되는지 확인.

- **express() is not callable**  
  → `functions/tsconfig.json`에  
  `module: "commonjs"`, `moduleResolution: "node"`, `esModuleInterop: true`.  
  Import는 `import express from 'express'`.

- **Property 'region' does not exist**  
  → v2 API 사용: `export const api = onRequest({ region: 'asia-northeast3' }, app);`

- **에뮬레이터 데이터가 안 남음**  
  → `--import ./.emuldata --export-on-exit` 옵션 사용.

---

## 코드 메모

- 초대코드: 혼동 문자 제외한 **대문자+숫자** 8자리, Firestore **중복 검사** 후 확정  
- 리전: **asia-northeast3(Seoul)** 통일  
- Functions 런타임: **Node 20**  
- Frontend: Vite, Hosting 리라이트로 동일 오리진 호출

---

## 라이선스

Internal / Team use only.

---

