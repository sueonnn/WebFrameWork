// import React, { useState }  from "react";
// import { Eye } from "lucide-react";
// import { signupEmail } from "../../apis/auth";

// const SignupPanel: React.FC = () => {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [pw, setPw] = useState("");
//   const [pw2, setPw2] = useState("");
//   const [show1, setShow1] = useState(false);
//   const [show2, setShow2] = useState(false);
//   const [agreeTerms, setAgreeTerms] = useState(false);
//   const [agreePrivacy, setAgreePrivacy] = useState(false);
//   const [busy, setBusy] = useState(false);
//   const [err, setErr] = useState<string | null>(null);

//   function mapFirebaseError(codeOrMsg?: string, message?: string) {
//     const text = codeOrMsg || message || "";
//     if (text.includes("auth/email-already-in-use")) return "이미 가입된 이메일입니다.";
//     if (text.includes("auth/invalid-email")) return "이메일 형식이 올바르지 않습니다.";
//     if (text.includes("auth/weak-password")) return "비밀번호가 너무 약합니다(8자 이상 권장).";
//     if (text.includes("auth/operation-not-allowed")) return "이메일/비밀번호 로그인이 비활성화되어 있습니다.";
//     if (text.includes("auth/network-request-failed")) return "네트워크 오류가 발생했습니다.";
//     return message || "회원가입에 실패했습니다.";
//   }


//   async function onSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     setErr(null);

//     try {
//       // UX: 사용자가 왜 안 되는지 바로 보이게
//       if (!agreeTerms || !agreePrivacy) throw new Error("약관 및 개인정보 처리방침에 동의해주세요.");
//       if (pw.length < 8) throw new Error("비밀번호는 8자 이상이어야 합니다.");
//       if (pw !== pw2) throw new Error("비밀번호가 일치하지 않습니다.");

//       setBusy(true);
//       console.log("[Signup] start", { name, email }); // 디버그 로그
//       await signupEmail(name.trim(), email, pw);
//       alert("회원가입 완료!");
//       // SPA 라우팅을 쓰지 않는다면 이것도 OK
//       window.location.href = "/";  // 또는 react-router: navigate("/")
//     }  catch (e: any) {
//       console.error("[Signup] error", e);
//       const code = String(e?.message || e); // 위에서 throw한 `${e.code}` 받기
//       setErr(mapFirebaseError(code, e?.message));
//     }finally {
//       setBusy(false);
//     }
//   }

//   return (
//     // <div className="flex flex-col space-y-4 p-8 ">
//     <form onSubmit={onSubmit} className="flex flex-col space-y-4 p-8">
//       {/* 이름 입력 */}
//       <div className="flex flex-col space-y-1">
//         <label htmlFor="name" className="text-sm font-medium text-gray-700">
//           이름
//         </label>
//         <input
//           id="name"
//           type="text"
//           placeholder="홍길동"
//           className="p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//           value={name}
//           onChange={(e)=>setName(e.target.value)}
//           required  
//         />
//       </div>

//       {/* 이메일 입력 */}
//       <div className="flex flex-col space-y-1">
//         <label
//           htmlFor="signup-email"
//           className="text-sm font-medium text-gray-700"
//         >
//           이메일
//         </label>
//         <input
//           id="signup-email"
//           type="email"
//           placeholder="name@school.ac.kr"
//           className="p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//           value={email}
//           onChange={(e)=>setEmail(e.target.value)}
//           required
//         />
//       </div>

//       {/* 비밀번호 입력 */}
//       <div className="flex flex-col space-y-1">
//         <label
//           htmlFor="signup-password"
//           className="text-sm font-medium text-gray-700"
//         >
//           비밀번호
//         </label>
//         <div className="relative">
//           <input
//             id="signup-password"
//             type={show1 ? "text" : "password"}
//             placeholder="8자 이상 + 숫자/문자 포함"
//             className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 pr-10"
//             value={pw}
//             onChange={(e)=>setPw(e.target.value)}
//             required
//           />
//           <Eye onClick={()=>setShow1(s=>!s)} className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 cursor-pointer" />
//         </div>
//       </div>

//       {/* 비밀번호 확인 */}
//       <div className="flex flex-col space-y-1">
//         <label
//           htmlFor="confirm-password"
//           className="text-sm font-medium text-gray-700"
//         >
//           비밀번호 확인
//         </label>
//         <div className="relative">
//           <input
//             id="confirm-password"
//             type={show2 ? "text" : "password"}
//             placeholder="비밀번호를 다시 입력하세요"
//             className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 pr-10"
//             value={pw2}
//             onChange={(e)=>setPw2(e.target.value)}
//             required
//           />
//           <Eye onClick={()=>setShow2(s=>!s)} className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 cursor-pointer" />
//         </div>
//       </div>

//       {/* 약관 동의 체크박스 */}
//       <div className="flex items-start pt-2">
//         <input
//           id="terms"
//           type="checkbox"
//           className="mt-1 h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
//           checked={agreeTerms}
//           onChange={(e)=>setAgreeTerms(e.target.checked)}
//         />
//         <label htmlFor="terms" className="ml-3 text-sm text-gray-600">
//           <span className="font-semibold text-indigo-600 hover:underline cursor-pointer">
//             이용약관
//           </span>
//           에 동의합니다.
//         </label>
//       </div>

//       <div className="flex items-start pt-2">
//         <input
//           id="terms"
//           type="checkbox"
//           className="mt-1 h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
//           checked={agreePrivacy}
//           onChange={(e)=>setAgreePrivacy(e.target.checked)}
//         />
//         <label htmlFor="terms" className="ml-3 text-sm text-gray-600">
//           <span className="font-semibold text-indigo-600 hover:underline cursor-pointer">
//             개인정보 처리방침
//           </span>
//           에 동의합니다.
//         </label>
//       </div>

//       {err && <p className="text-sm text-red-600">{err}</p>}

//       {/* 회원가입 버튼 */}
//       <button type="submit"
//         disabled={busy}
//         className="w-full py-3 mt-4 text-white font-semibold bg-indigo-600 rounded-md shadow-md hover:bg-indigo-700 transition duration-150">
//         {busy ? "가입 중..." : "회원가입"}
//       </button>
//     {/* </div> */}
//   </form> 
//   );
// };

// export default SignupPanel;

import React, { useState }  from "react";
import { Eye } from "lucide-react";
import { signupEmail } from "../../apis/auth";

const SignupPanel: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  function mapFirebaseError(codeOrMsg?: string, message?: string) {
    const text = codeOrMsg || message || "";
    if (text.includes("auth/email-already-in-use")) return "이미 가입된 이메일입니다.";
    if (text.includes("auth/invalid-email")) return "이메일 형식이 올바르지 않습니다.";
    if (text.includes("auth/weak-password")) return "비밀번호가 너무 약합니다(8자 이상 권장).";
    if (text.includes("auth/operation-not-allowed")) return "이메일/비밀번호 로그인이 비활성화되어 있습니다.";
    if (text.includes("auth/network-request-failed")) return "네트워크 오류가 발생했습니다.";
    return message || "회원가입에 실패했습니다.";
  }

  async function handleSignup() {
    setErr(null);
    try {
      if (!agreeTerms || !agreePrivacy) throw new Error("약관 및 개인정보 처리방침에 동의해주세요.");
      if (pw.length < 8) throw new Error("비밀번호는 8자 이상이어야 합니다.");
      if (pw !== pw2) throw new Error("비밀번호가 일치하지 않습니다.");

      setBusy(true);
      console.log("[Signup] start", { name, email });
      await signupEmail(name.trim(), email, pw);

      // 이메일 자동입력용 임시 저장
      sessionStorage.setItem("prefillEmail", email);

      // alert("회원가입 완료!");
      // 로그인 화면으로 이동 + 성공 플래그
      window.location.replace("/login?signup=ok");
    } catch (e: any) {
      console.error("[Signup] error", e);
      const code = String(e?.message || e);
      setErr(mapFirebaseError(code, e?.message));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col space-y-4 p-8"> {/* ← form 대신 div */}
      {/* 이름 */}
      <div className="flex flex-col space-y-1">
        <label htmlFor="name" className="text-sm font-medium text-gray-700">이름</label>
        <input
          id="name"
          type="text"
          placeholder="홍길동"
          className="p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          value={name}
          onChange={(e)=>setName(e.target.value)}
          required
        />
      </div>

      {/* 이메일 */}
      <div className="flex flex-col space-y-1">
        <label htmlFor="signup-email" className="text-sm font-medium text-gray-700">이메일</label>
        <input
          id="signup-email"
          type="email"
          placeholder="name@school.ac.kr"
          className="p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          required
        />
      </div>

      {/* 비밀번호 */}
      <div className="flex flex-col space-y-1">
        <label htmlFor="signup-password" className="text-sm font-medium text-gray-700">비밀번호</label>
        <div className="relative">
          <input
            id="signup-password"
            type={show1 ? "text" : "password"}
            placeholder="8자 이상 + 숫자/문자 포함"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 pr-10"
            value={pw}
            onChange={(e)=>setPw(e.target.value)}
            required
          />
          <Eye onClick={()=>setShow1(s=>!s)} className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 cursor-pointer" />
        </div>
      </div>

      {/* 비밀번호 확인 */}
      <div className="flex flex-col space-y-1">
        <label htmlFor="confirm-password" className="text-sm font-medium text-gray-700">비밀번호 확인</label>
        <div className="relative">
          <input
            id="confirm-password"
            type={show2 ? "text" : "password"}
            placeholder="비밀번호를 다시 입력하세요"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 pr-10"
            value={pw2}
            onChange={(e)=>setPw2(e.target.value)}
            required
          />
          <Eye onClick={()=>setShow2(s=>!s)} className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 cursor-pointer" />
        </div>
      </div>

      {/* 체크박스 (id 중복 방지) */}
      <div className="flex items-start pt-2">
        <input
          id="agree-terms"
          type="checkbox"
          className="mt-1 h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          checked={agreeTerms}
          onChange={(e)=>setAgreeTerms(e.target.checked)}
        />
        <label htmlFor="agree-terms" className="ml-3 text-sm text-gray-600">
          <span className="font-semibold text-indigo-600 hover:underline cursor-pointer">이용약관</span>에 동의합니다.
        </label>
      </div>

      <div className="flex items-start pt-2">
        <input
          id="agree-privacy"
          type="checkbox"
          className="mt-1 h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          checked={agreePrivacy}
          onChange={(e)=>setAgreePrivacy(e.target.checked)}
        />
        <label htmlFor="agree-privacy" className="ml-3 text-sm text-gray-600">
          <span className="font-semibold text-indigo-600 hover:underline cursor-pointer">개인정보 처리방침</span>에 동의합니다.
        </label>
      </div>

      {err && <p className="text-sm text-red-600">{err}</p>}

      {/* 제출 버튼: onClick으로 직접 실행 */}
      <button
        type="button"
        onClick={handleSignup}
        disabled={busy}
        className="w-full py-3 mt-4 text-white font-semibold bg-indigo-600 rounded-md shadow-md hover:bg-indigo-700 transition duration-150 disabled:opacity-50"
      >
        {busy ? "가입 중..." : "회원가입"}
      </button>
    </div>
  );
};

export default SignupPanel;
