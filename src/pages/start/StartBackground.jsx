import bg from "../../assets/images/start-background.svg";

export default function StartBackground() {
  return (
    <img
      src={bg}
      alt="start background"
      style={{
        width: "1200px",
        height: "675px",
        objectFit: "cover",
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: -1,
      }}
    />
  );
}
