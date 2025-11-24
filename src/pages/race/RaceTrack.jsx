import { useContext, useRef, useEffect, useState } from "react";
import { RaceContext } from "./RaceManager";
import background from "../../assets/images/race-background.svg";
import startLine from "../../assets/images/race-line.svg";

export default function RaceTrack() {
  const canvasRef = useRef(null);
  const { raceCars = [], TRACK_LENGTH = 7000, hostId, isRaceFinished } =
    useContext(RaceContext);
  const [nameTags, setNameTags] = useState([]);

  const raceCarsRef = useRef(raceCars);
  const hostIdRef = useRef(hostId);
  const carImgCache = useRef(new Map());
  const frameRef = useRef(null);

  const SCREEN_WIDTH = 1200;
  const SCREEN_HEIGHT = 675;

  useEffect(() => {
    raceCarsRef.current = raceCars;

    raceCars.forEach((car) => {
      if (!carImgCache.current.has(car.memberId) || carImgCache.current.get(car.memberId).src !== car.img) {
        const im = new Image();
        im.src = car.img;
        carImgCache.current.set(car.memberId, im);
      }
    });
  }, [raceCars]);

  useEffect(() => {
    hostIdRef.current = hostId;
  }, [hostId]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const bg = new Image();
    bg.src = background;

    const lineImg = new Image();
    lineImg.src = startLine;

    const memberId = Number(localStorage.getItem("memberId"));

    const drawFrame = () => {
      const cars = raceCarsRef.current;
      const currentHostId = hostIdRef.current;

      const me =
        cars.find((car) => car.memberId === memberId) || cars[0];
      const targetX = SCREEN_WIDTH * 0.35;
      const cameraX = me ? Math.max(0, me.currentX - targetX) : 0;

      ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

      if (bg.complete) {
        const bgWidth = bg.width || SCREEN_WIDTH;
        const offset = -(cameraX % bgWidth);
        for (let i = -1; i < 3; i++) {
          ctx.drawImage(bg, offset + i * bgWidth, 0, bgWidth, SCREEN_HEIGHT);
        }
      }

      const barWidth = 900;
      const barHeight = 10;
      const barX = SCREEN_WIDTH / 2 - barWidth / 2;
      const barY = 635;

      ctx.fillStyle = "rgba(255,255,255,0.25)";
      ctx.fillRect(barX, barY, barWidth, barHeight);

      cars.forEach((car) => {
        const progress = Math.min(car.currentX / TRACK_LENGTH, 1);
        const dotX = barX + progress * barWidth;

        ctx.beginPath();
        ctx.arc(dotX, barY + barHeight / 2, 8, 0, Math.PI * 2);
        ctx.fillStyle = car.color;
        ctx.fill();
      });

      const newNameTags = [];
      cars.forEach((car) => {
        const offsetX = 110;
        const drawX = car.currentX - cameraX + offsetX;

        const img = carImgCache.current.get(car.memberId);
        if (img?.complete) {
          const width = car.width;
          const ratio = img.height / img.width || 1;
          const height = width * ratio;

          const y = 180 + car.lane * 105;
          ctx.drawImage(img, drawX, y, width, height);

          const isHost = currentHostId && car.memberId === Number(currentHostId);
          newNameTags.push({
            memberId: car.memberId,
            name: car.name,
            x: drawX,
            y: y - 10,
            isHost,
          });
        }
      });

      setNameTags(newNameTags);

      if (!isRaceFinished) {
        frameRef.current = requestAnimationFrame(drawFrame);
      }
    };

    cancelAnimationFrame(frameRef.current);
    drawFrame();

    return () => cancelAnimationFrame(frameRef.current);
  }, [TRACK_LENGTH, isRaceFinished]);

  return (
    <div style={{ position: "relative", width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}>
      <canvas
        ref={canvasRef}
        width={SCREEN_WIDTH}
        height={SCREEN_HEIGHT}
        style={{
          width: SCREEN_WIDTH,
          height: SCREEN_HEIGHT,
          display: "block",
          background: "#111",
        }}
      />
      {/* 닉네임과 별 아이콘 overlay */}
      {nameTags.map((tag) => (
        <div
          key={tag.memberId}
          style={{
            position: "absolute",
            left: `${tag.x}px`,
            top: `${tag.y - 25}px`,
            display: "flex",
            alignItems: "center",
            gap: "4px",
            pointerEvents: "none",
          }}
        >
          {tag.isHost && (
            <i
              className="bi bi-star-fill"
              style={{
                color: "#ffd700",
                fontSize: "16px",
              }}
            />
          )}
          <span
            style={{
              color: "#fff",
              fontSize: "20px",
              fontFamily: "Pretendard",
              fontWeight: "bold",
              textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
            }}
          >
            {tag.name}
          </span>
        </div>
      ))}
    </div>
  );
}
