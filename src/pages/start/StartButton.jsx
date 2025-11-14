import startButtonImg from "../../assets/images/start-gamestartbutton.svg";

export default function StartButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "none",
        border: "none",
        padding: 0,
        cursor: "pointer",
        display: "inline-block",
        position: "relative",
        left: "175px",   // 오른쪽으로 이동
        top: "50px",     // 아래로 이동
      }}
      onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
      onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      <img
        src={startButtonImg}
        alt="게임 시작 버튼"
        style={{
          display: "block",
          width: "420px",
          height: "auto",
        }}
      />
    </button>
  );
}
