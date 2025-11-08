import express from 'express';
import { onRequest } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import { createGroupHandler, joinGroupByCodeHandler } from './groups';

if (!admin.apps.length) admin.initializeApp();

const app = express();
app.use(express.json());

// 두 경로 모두 등록 (호스팅 리라이트/에뮬 환경에서 경로 전달 차이를 흡수)
app.post('/groups', createGroupHandler);
app.post('/api/groups', createGroupHandler);

app.post('/groups/join', joinGroupByCodeHandler);
app.post('/api/groups/join', joinGroupByCodeHandler);

// 헬스체크
app.get(['/health', '/api/health'], (_req, res) => res.json({ ok: true, t: Date.now() }));

export const api = onRequest({ region: 'asia-northeast3' }, app);
