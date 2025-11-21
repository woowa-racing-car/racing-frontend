export default function RaceNameTag({ name }) {
  return (
    <div
      style={{
        position: "absolute",
        top: -40,
        left: "50%",
        transform: "translateX(-50%)",
        background: "#2e8eff",
        color: "white",
        fontWeight: "bold",
        fontSize: "18px",
        padding: "6px 16px",
        borderRadius: "20px",
        border: "3px solid white",
        boxShadow: "0 3px 6px rgba(59, 59, 59, 0.3)",
        whiteSpace: "nowrap",
      }}
    >
      {name}
    </div>
  );
}
