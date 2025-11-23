import { useNavigate } from "react-router-dom";
import ExitImg from "../../assets/images/result-exit-button.svg";

export default function ResultExitButton({ delay = 0 }) {
  const navigate = useNavigate();

  return (
    <img
      src={ExitImg}
      alt="exit button"
      className="exit-appear"
      style={{
        animationDelay: `${delay}s`,
        position: "absolute",
        right: "40px",
        bottom: "40px",
        width: "170px",
        cursor: "pointer",
      }}
      onClick={() => navigate("/start")}
    />
  );
}
