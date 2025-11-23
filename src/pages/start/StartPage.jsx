import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import StartBackground from "./StartBackground";
import StartButton from "./StartButton";
import StartScoreBoard from "./StartScoreBoard";
import CommonHeader from "../../components/CommonHeader";
import { useUser } from "../../context/UserContext";

export default function StartPage() {
  const navigate = useNavigate();
  const {fetchUser}=useUser();

  const [winCount, setWinCount]=useState(0);
  const [drawCount, setDrawCount]=useState(0);
  const [loseCount, setLoseCount]=useState(0);
  const [winRate, setWinRate]=useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("로그인이 필요합니다.");
      navigate("/"); 
      return;
    }
    
    fetchUser();

    const fetchStartInfo=async()=>{
      try{
        const {data}=await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/v1/start`,
          {
            headers:{
              Authorization:`${token}`,
            },
          }
        );

        const result=data.data;

        setWinCount(result.winCount);
        setDrawCount(result.drawCount);
        setLoseCount(result.loseCount);

        const winRate=result.winRate.toFixed(1);

        setWinRate(winRate);
      } catch(error){
        console.error("API 호출 실패: ",err);
        alert("로그인이 만료되었거나, 인증에 실패하였습니다.");
        negivate("/");
      }
    };

    fetchStartInfo();
  }, [navigate, fetchUser]);

  const handleStartClick = () => {
    navigate("/start-transition");  
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
          <StartScoreBoard 
            wins={winCount} 
            draws={drawCount}
            losses={loseCount} 
            winRate={winRate} />
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
