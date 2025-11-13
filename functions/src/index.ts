import express from 'express';
import { onRequest } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import cors from 'cors';
import { createGroupHandler, joinGroupByCodeHandler } from './groups';

if (!admin.apps.length) admin.initializeApp();

const app = express();
app.use(express.json());

// (필요 시) CORS – 같은 오리진(Hosting 리라이트)만 쓸 거면 생략 가능
app.use(cors({ origin: true }));

// ── 토큰 검증 미들웨어 ──
async function authGuard(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<void> {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : "";

    if (!token) {
      res.status(401).json({ error: "Missing Authorization" });
      return;
    }

    const decoded = await admin.auth().verifyIdToken(token);
    (req as any).uid = decoded.uid;
    next();
    return;
  } catch {
    res.status(401).json({ error: "Invalid token" });
    return;
  }
}

// 헬스체크(무인증)
app.get(['/health', '/api/health'], (_req, res) => res.json({ ok: true, t: Date.now() }));

// 보호 경로 (인증 필요)
app.post(['/groups', '/api/groups'], authGuard, createGroupHandler);
app.post(['/groups/join', '/api/groups/join'], authGuard, joinGroupByCodeHandler);

export const api = onRequest({ region: 'asia-northeast3' }, app);
