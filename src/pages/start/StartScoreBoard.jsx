import scoreBoardImg from "../../assets/images/start-scoreboard.svg";

export default function StartScoreBoard({ wins, losses, winRate }) {
  return (
    <div
      style={{
        position: "relative",
        width: "380px",  
        height: "380px",
      }}
    >

      <img
        src={scoreBoardImg}
        alt="scoreboard"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 0,
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          fontSize: "32px",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        <div>{wins}승 {losses}패</div>

        <div
          style={{
            width: "70%",
            height: "4px",
            backgroundColor: "white",
            margin: "20px 0",
          }}
        />

        <div>승률 {winRate}%</div>
      </div>
    </div>
  );
}
