// functions/src/groups.ts
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { Request, Response } from 'express';
import * as admin from 'firebase-admin';

function db() {
  if (!admin.apps.length) admin.initializeApp(); // ← 보수적으로 보장
  return getFirestore();
}

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const genCode = () =>
  Array.from({ length: 8 }, () => ALPHABET[Math.floor(Math.random() * ALPHABET.length)]).join('');

export async function createGroupHandler(req: Request, res: Response) {
  try {
    const { name, description, basePlaceType, baseAddress, baseLatitude, baseLongitude } = req.body || {};
    if (!name || !basePlaceType || !baseAddress || typeof baseLatitude !== 'number' || typeof baseLongitude !== 'number') {
      return res.status(400).json({ message: 'bad request' });
    }

    const groups = db().collection('groups'); // ← 여기서 db() 호출
    for (let i = 0; i < 10; i++) {
      const code = genCode();
      const dup = await groups.where('inviteCode', '==', code).limit(1).get();
      if (!dup.empty) continue;

      const doc = await groups.add({
        name,
        description: description ?? null,
        basePlaceType,
        baseAddress,
        baseLatitude,
        baseLongitude,
        inviteCode: code,
        createdAt: FieldValue.serverTimestamp(),
      });
      return res.status(201).json({ id: doc.id, inviteCode: code });
    }
    return res.status(500).json({ message: 'failed to generate invite code' });
  } catch (e) {
    console.error('[createGroupHandler] error', e);
    return res.status(500).json({ message: 'server error' });
  }
}

export async function joinGroupByCodeHandler(req: Request, res: Response) {
  try {
    const { code, uid } = req.body || {};
    if (!code || !uid) return res.status(400).json({ message: 'bad request' });

    const snap = await db().collection('groups').where('inviteCode', '==', code).limit(1).get();
    if (snap.empty) return res.status(404).json({ message: 'invalid code' });

    const group = snap.docs[0];
    await db().collection('groups').doc(group.id).collection('members').doc(uid).set({
      role: 'member',
      joinedAt: FieldValue.serverTimestamp(), 
    }, { merge: true });

    return res.json({ id: group.id, name: group.get('name') });
  } catch (e) {
    console.error('[joinGroupByCodeHandler] error', e);
    return res.status(500).json({ message: 'server error' });
  }
}
