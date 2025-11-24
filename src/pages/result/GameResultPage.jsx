import PlayerResultCard from "./PlayerResultCard";
import ResultExitButton from "./ResultExitButton";
import ResultBackground from "./ResultBackground";

const CARD_DELAY = 0.3;
const EXIT_EXTRA_DELAY = 0.3;

export default function GameResultPage({ players, onExit }) {
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
        zIndex: 1000, // 기존 화면 위에 오버레이
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

        <ResultExitButton delay={exitDelay} onClick={onExit} />
      </div>
    </div>
  );
}
