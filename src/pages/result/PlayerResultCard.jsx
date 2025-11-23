import FirstBg from "../../assets/images/result-1st-player.svg";
import SecondBg from "../../assets/images/result-2nd-player.svg";
import ThirdBg from "../../assets/images/result-3rd-player.svg";
import { BsCoin } from "react-icons/bs";
import "./result.css"; 

export default function PlayerResultCard({ rank, name, score, delay = 0 }) {
  const bg = rank === 1 ? FirstBg : rank === 2 ? SecondBg : ThirdBg;

  return (
    <div
      className="slide-in"
      style={{
        animationDelay: `${delay}s`,  
        width: "600px",
        height: "120px",
        backgroundImage: `url(${bg})`,
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",
        display: "flex",
        alignItems: "center",

        padding: "55px 50px 12px 60px",

        fontSize: "24px",
        fontWeight: "800",
        boxSizing: "border-box",
      }}
    >
     
      <span style={{ fontSize: "22px" }}>
        {name}
      </span>

    
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          background: "#fff",
          padding: "7px 14px",
          borderRadius: "28px",
          border: "2px solid rgba(0,0,0,0.2)",
          marginLeft: "300px",
        }}
      >
        <BsCoin size={18} color="#F4C247" />
        <span style={{ fontWeight: "800", fontSize: "20px" }}>
          {score > 0 ? `+${score}` : score}
        </span>
      </div>
    </div>
  );
}
