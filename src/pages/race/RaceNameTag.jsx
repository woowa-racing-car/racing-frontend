export default function RaceNameTag({ name }) {
  return (
    <div
      style={{
        position: "absolute",
        top: -40,
        left: "50%",
        transform: "translateX(-50%)",
        background: "#2e8eff",
        padding: "6px 14px",
        borderRadius: "20px",
        color: "#fff",
        fontWeight: "bold",
        border: "3px solid white",
        boxShadow: "0 3px 6px rgba(0,0,0,0.3)",
        whiteSpace: "nowrap",
        zIndex: 200,
      }}
    >
      {name}
    </div>
  );
}
