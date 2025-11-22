// import {
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   updateProfile,
//   sendPasswordResetEmail,
//   signOut,
// } from "firebase/auth";
// import { doc, setDoc, serverTimestamp } from "firebase/firestore";
// import { auth } from "../lib/firebase";
// import { db } from "../lib/firebase";

// export async function signupEmail(displayName: string, email: string, password: string) {
//   const cred = await createUserWithEmailAndPassword(auth, email, password);
//   if (displayName) await updateProfile(cred.user, { displayName });

//   // Firestore는 fire-and-forget (규칙/네트워크 문제여도 가입 자체를 막지 않음)
//   if (db) {
//     setDoc(
//       doc(db, "users", cred.user.uid),
//       {
//         uid: cred.user.uid,
//         email,
//         displayName: displayName || null,
//         provider: "password",
//         createdAt: serverTimestamp(),
//         updatedAt: serverTimestamp(),
//       },
//       { merge: true }
//     ).catch((e) => console.warn("[users doc write skipped]", e));
//   }

//   return cred.user;
// }

// export async function loginEmail(email: string, password: string) {
//   const cred = await signInWithEmailAndPassword(auth, email, password);
//   return cred.user;
// }
// export function resetPassword(email: string) { return sendPasswordResetEmail(auth, email); }
// export function logout() { return signOut(auth); }
