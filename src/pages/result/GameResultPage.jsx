import PlayerResultCard from "./PlayerResultCard";
import ResultExitButton from "./ResultExitButton";
import ResultBackground from "./ResultBackground";

const CARD_DELAY = 0.3;       
const EXIT_EXTRA_DELAY = 0.3;  

export default function GameResultPage() {
  const players = [
    { rank: 1, name: "지환", score: 1000 },
    { rank: 2, name: "지명", score: 0 },
    { rank: 3, name: "아름", score: -1000 },
  ];

  const exitDelay = players.length * CARD_DELAY + EXIT_EXTRA_DELAY;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "white",
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
        <ResultBackground />
        <div
          style={{
            position: "absolute",
            top: "170px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            zIndex: 20,
          }}
        >
          {players.map((player, index) => (
            <PlayerResultCard
              key={player.rank}
              {...player}
              delay={index * CARD_DELAY} 
            />
          ))}
        </div>

        <ResultExitButton delay={exitDelay} />
      </div>
    </div>
  );
}
