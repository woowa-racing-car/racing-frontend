import scoreBoardImg from "../../assets/images/start-scoreboard.svg";

export default function StartScoreBoard({ wins, losses, winRate }) {
  return (
    <div
      style={{
        position: "relative",
        width: "500px",   
        height: "500px", 
        transform: "scale(1.3)",  
        transformOrigin: "center",
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
    fontSize: "37px",
    fontFamily: "Giants-Bold",  
    fontWeight: "bold",
    textAlign: "center",
    transform: "translateY(-129px)", 
  }}
>

        <div>{wins}승 {losses}패</div>
        <div style={{ marginTop: "50px" }}></div>

        <div>승률 {winRate}%</div>
      </div>
    </div>
  );
}
