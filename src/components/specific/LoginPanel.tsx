import React, { useState, useEffect } from "react";
import { Eye } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const LoginPanel: React.FC = () => {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null); // 성공 메시지

  const { loginWithEmail } = useAuth();     
  const navigate = useNavigate();     

    //  최초 진입 시 이메일 자동입력 + 메시지
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("signup") === "ok") {
      setInfo("회원가입이 완료되었습니다. 로그인 해주세요.");
    }
    const prefill = sessionStorage.getItem("prefillEmail");
    if (prefill) {
      setEmail(prefill);
      sessionStorage.removeItem("prefillEmail");
    }
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      await loginWithEmail(email, pw);
      // 로그인 성공하면홈으로
      navigate("/");
    } catch (e: any) {
      setErr(e?.message ?? "로그인에 실패했습니다.");
    } finally {
      setBusy(false);
    }
  }

  function onReset() {
    if (!email) {
      setErr("재설정 안내를 받으려면 이메일을 먼저 입력하세요.");
      return;
    }
    setErr(null);
    setInfo("데모 버전에서는 비밀번호 재설정 메일을 보내지 않습니다.");
  }

{/* <div className="flex flex-col space-y-6 p-8 "></div> */}
  return (
     <form onSubmit={onSubmit} className="flex flex-col space-y-6 p-8">
      {/* 성공 안내 */}
      {info && <p className="text-sm text-green-600">{info}</p>}
      <div className="flex flex-col space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-gray-700">
          이메일
        </label>
        <input
          id="email"
          type="email"
          placeholder="name@school.ac.kr"
          className="p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-gray-700">
          비밀번호
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPw ? "text" : "password"}
            placeholder="8자 이상 + 숫자/문자 포함"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 pr-10"
            value={pw}
            onChange={(e)=>setPw(e.target.value)}
            required
          />
          <Eye onClick={()=>setShowPw(s=>!s)} className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 cursor-pointer" />
        </div>
      </div>

      {err && <p className="text-sm text-red-600">{err}</p>}  

      <button type="submit" disabled={busy} className="w-full py-3 mt-4 text-white font-semibold bg-indigo-600 rounded-md shadow-md hover:bg-indigo-700 transition duration-150">
        {busy ? "로그인 중..." : "로그인"}
      </button>

      {/* <a
        href="#"
        className="text-sm text-center text-gray-500 hover:text-indigo-600 mt-4"
      >
        비밀번호를 잊으셨나요?
      </a> */}
      <button
        type="button"
        onClick={onReset}
        className="text-sm text-center text-gray-500 hover:text-indigo-600 mt-2"
      >
        비밀번호를 잊으셨나요?
      </button>
    {/* </div> */}
    </form>
  );
};

export default LoginPanel;
