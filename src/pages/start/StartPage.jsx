import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import StartBackground from "./StartBackground";
import StartButton from "./StartButton";
import StartScoreBoard from "./StartScoreBoard";
import CommonHeader from "../../components/CommonHeader";

export default function StartPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("로그인이 필요합니다.");
      navigate("/"); 
    }
  }, [navigate]);

  const handleStartClick = () => {
    navigate("/price-entry");  
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "1200px",
          height: "675px",
          overflow: "hidden",
        }}
      >
        <CommonHeader />
        <StartBackground />

        <div
          style={{
            position: "absolute",
            right: "160px",
            top: "160px",
            width: "380px",
            height: "380px",
            zIndex: 1,
          }}
        >
          <StartScoreBoard wins={12} losses={5} winRate={70} />
        </div>

        <div
          style={{
            position: "absolute",
            right: "260px",
            top: "420px",
            zIndex: 1,
          }}
        >
          <StartButton onClick={handleStartClick} /> 
          
        </div>
      </div>
    </div>
  );
}
