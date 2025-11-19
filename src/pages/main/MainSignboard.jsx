import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";    
import signboardImg from "../../assets/images/main-signboard.svg";
import joinImg from "../../assets/images/main-join.svg";
import loginImg from "../../assets/images/main-login.svg";
import MainInput from "./MainInput";

export default function MainSignboard() {
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const navigate = useNavigate();  

  const [mode, setMode] = useState("login");

  const [name, setName] = useState("");
  const [loginId, setLoginId] = useState("");
  const [loginPw, setLoginPw] = useState("");
  const [message, setMessage] = useState("");

  const handleLoginClick = () => setMode("login");
  const handleJoinClick = () => setMode("join");

  const handleJoin = async () => {
    if (!name || !loginId || !loginPw) {
      setMessage("모든 필드를 입력해주세요.");
      return;
    }

    try {
      const res = await axios.post(`${baseUrl}/api/v1/auth/join`, {
        name,
        loginId,
        loginPw,
      });

      if (res.data.status === 200) {
        setMessage("회원가입 성공! 자동으로 로그인합니다.");
        await handleLogin();  
      } else {
        setMessage(res.data.reason || "회원가입 완료");
      }
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.reason || "회원가입 실패");
      } else {
        setMessage("서버 연결 실패");
      }
    }
  };

  const handleLogin = async () => {
    if (!loginId || !loginPw) {
      setMessage("아이디와 비밀번호를 입력해주세요.");
      return;
    }

    try {

      const res = await axios.post(`${baseUrl}/api/v1/auth/login`, {
        loginId,
        loginPw,
      });

      const token = res.headers.authorization;

      if (res.data.status === 200) {
        if (token) {
          localStorage.setItem("token", token);
          setMessage("로그인 성공!");

          navigate("/start");
        } else {
          setMessage("로그인 성공 (토큰 없음)");
        }
      } else {
        setMessage(res.data.reason || "로그인 실패");
      }
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.reason || "로그인 실패");
      } else {
        setMessage("서버 연결 실패");
      }
    }
  };

  return (
    <div
      className="fade-item"
      style={{
        position: "absolute",
        top: "57%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: mode === "join" ? "590px" : "500px",
        height: mode === "join" ? "300px" : "250px",
        backgroundImage: `url(${signboardImg})`,
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        zIndex: 20,
      }}
    >

      <div
        style={{
          position: "absolute",
          left: "48%",
          transform: "translateX(-50%)",
          top: mode === "join" ? 56 : 60,
          width: "67%",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          fontFamily: "Giants-Regular",
        }}
      >
        {mode === "login" ? (
          <>
            <MainInput
              label="아이디"
              type="text"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
            />
            <MainInput
              label="비밀번호"
              type="password"
              value={loginPw}
              onChange={(e) => setLoginPw(e.target.value)}
            />
          </>
        ) : (
          <>
            <MainInput
              label="닉네임"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <MainInput
              label="아이디"
              type="text"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
            />
            <MainInput
              label="비밀번호"
              type="password"
              value={loginPw}
              onChange={(e) => setLoginPw(e.target.value)}
            />
          </>
        )}
      </div>

      <div
        style={{
          position: "absolute",
          left: mode === "join" ? 120 : 80,
          bottom: mode === "join" ? 55 : 40,
          display: "flex",
          gap: "30px",
        }}
      >
        <img
          src={loginImg}
          alt="login"
          style={{
            width: "140px",
            cursor: "pointer",
            userSelect: "none",
            opacity: mode === "login" ? 1 : 0.6,
            transition: "opacity 0.2s ease",
          }}
          onClick={() => {
            if (mode === "login") handleLogin();
            else handleLoginClick();
          }}
        />
        <img
          src={joinImg}
          alt="join"
          style={{
            width: "140px",
            cursor: "pointer",
            userSelect: "none",
            opacity: mode === "join" ? 1 : 0.6,
            transition: "opacity 0.2s ease",
          }}
          onClick={() => {
            if (mode === "join") handleJoin();
            else handleJoinClick();
          }}
        />
      </div>


      {message && (
        <div
          style={{
            position: "absolute",
            bottom: 10,
            left: "50%",
            transform: "translateX(-50%)",
            color: "#fff",
            fontSize: "14px",
            textAlign: "center",
            fontFamily: "Giants-Regular",
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
}
