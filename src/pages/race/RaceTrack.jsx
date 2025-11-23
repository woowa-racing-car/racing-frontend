import { useContext, useRef, useEffect } from "react";
import { RaceContext } from "./RaceManager";
import background from "../../assets/images/race-background.svg";
import startLine from "../../assets/images/race-line.svg";

export default function RaceTrack() {
  const canvasRef = useRef(null);
  const { raceCars = [], TRACK_LENGTH = 7000 } = useContext(RaceContext);

  const SCREEN_WIDTH = 1200;
  const SCREEN_HEIGHT = 675;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const bg = new Image();
    bg.src = background;

    const lineImg = new Image();
    lineImg.src = startLine;

    // 👇 carImgs에서도 id → memberId 로 변경
    const carImgs = raceCars.map((car) => {
      const im = new Image();
      im.src = car.img;
      return { memberId: car.memberId, img: im };
    });

    function loop() {
      // const me = raceCars[0]; // 기준 카메라
      const me = raceCars.find(car => car.memberId == Number(localStorage.getItem("memberId"))) || raceCars[0];
      
      // console.log(me);

      const targetX = SCREEN_WIDTH * 0.35;

      // 🔥 cameraX 계산 시 car.x → car.currentX
      const cameraX = me ? Math.max(0, me.currentX - targetX) : 0;

      ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

      // 배경
      if (bg.complete) {
        const bgWidth = bg.width;
        const offset = -(cameraX % bgWidth);
        for (let i = -1; i < 3; i++) {
          ctx.drawImage(bg, offset + i * bgWidth, 0, bgWidth, SCREEN_HEIGHT);
        }
      }

      // 진행도 바
      const barWidth = 900;
      const barHeight = 10;
      const barX = SCREEN_WIDTH / 2 - barWidth / 2;
      const barY = 635;

      ctx.fillStyle = "rgba(255,255,255,0.25)";
      ctx.fillRect(barX, barY, barWidth, barHeight);

      raceCars.forEach((car) => {
        // 🔥 progress 계산 시 car.x → car.currentX
        const progress = Math.min(car.currentX / TRACK_LENGTH, 1);
        const dotX = barX + progress * barWidth;

        ctx.beginPath();
        ctx.arc(dotX, barY + barHeight / 2, 8, 0, Math.PI * 2);
        ctx.fillStyle = car.color;
        ctx.fill();
      });

      // 자동차 렌더링
      raceCars.forEach((car) => {
        const offsetX = 110;

        // 🔥 drawX 계산 시 car.x → car.currentX
        const drawX = car.currentX - cameraX + offsetX;

        const imgObj = carImgs.find((i) => i.memberId === car.memberId);
        if (imgObj?.img.complete) {
          const width = car.width;
          const ratio = imgObj.img.height / imgObj.img.width;
          const height = width * ratio;

          const y = 180 + car.lane * 105;
          ctx.drawImage(imgObj.img, drawX, y, width, height);

          // 이름 라벨
          ctx.font = "20px Pretendard";
          ctx.fillStyle = "#fff";
          ctx.textAlign = "left";
          ctx.fillText(car.name, drawX, y - 10);
        }
      });

      requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);
  }, [raceCars]);

  return (
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
  );
}
