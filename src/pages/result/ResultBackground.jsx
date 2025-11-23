import Bg from "../../assets/images/result-background.svg";

export default function ResultBackground() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: -1,
      }}
    >
      <img
        src={Bg}
        alt="background"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    </div>
  );
}
