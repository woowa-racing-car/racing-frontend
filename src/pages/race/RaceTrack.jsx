import { useContext, useRef, useEffect } from "react";
import { RaceContext } from "./RaceManager";
import background from "../../assets/images/race-background.svg";
import startLine from "../../assets/images/race-line.svg"; // 🔥 출발선 이미지 추가

export default function RaceTrack() {
  const canvasRef = useRef(null);
  const { raceCars } = useContext(RaceContext);

  const SCREEN_WIDTH = 1200;
  const SCREEN_HEIGHT = 675;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const bg = new Image();
    bg.src = background;

    const lineImg = new Image();
    lineImg.src = startLine;

    const carImages = raceCars.map(car => {
      const img = new Image();
      img.src = car.img;
      return { id: car.id, img };
    });

    function loop() {
      const me = raceCars.find(c => c.id === 1);

      // 🔥 중앙으로 들어오기 전까지 화면 고정
      const targetCenterX = SCREEN_WIDTH / 2;
      let cameraX;

      if (me.x < targetCenterX) {
        cameraX = 0;              // 출발 구간: 화면 고정
      } else {
        cameraX = me.x - targetCenterX; // 중앙 이후: 화면 따라가기
      }

      ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

      // === 배경 ===
      if (bg.complete) {
        const bgWidth = bg.width;
        const offset = -(cameraX % bgWidth);
        for (let i = -1; i < 3; i++) {
          ctx.drawImage(bg, offset + i * bgWidth, 0, bgWidth, SCREEN_HEIGHT);
        }
      }
// === 🏁 출발선 ===
if (lineImg.complete) {
  const startLineWorldX = 500; // 출발선 절대 위치
  const startLineX = startLineWorldX - cameraX;
  const startLineY = 262;

  const scale = 0.625;
  const width = lineImg.width * scale;
  const height = lineImg.height * scale;

  ctx.drawImage(lineImg, startLineX, startLineY, width, height);
}


      // === 🚗 자동차 + 라벨 ===
      raceCars.forEach(car => {
  const offsetCarX = 110; // 🔥 오른쪽 이동값
  const drawX = car.x - cameraX + offsetCarX;

        const imgObj = carImages.find(i => i.id === car.id);
        if (imgObj?.img?.complete) {
          const width = car.width;
          const ratio = imgObj.img.height / imgObj.img.width;
          const height = width * ratio;

          const baseY = 180;
          const laneSpacing = 105;
          const y = baseY + car.lane * laneSpacing;

          // 🚗 자동차 렌더
          ctx.drawImage(imgObj.img, drawX, y, width, height);

          // 🔥 이름 라벨 추가
          const labelX = drawX + width / 2 - 35;
          const labelY = y - 20;

          const text = car.name || `car${car.id}`;
          const paddingX = 16;

          ctx.font = "20px Pretendard";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";

          const textWidth = ctx.measureText(text).width;
          const boxWidth = textWidth + paddingX * 2;
          const boxHeight = 40;
          const radius = 20;

          ctx.fillStyle = "rgba(0,0,0,0.6)";
          drawRoundRect(ctx, labelX - boxWidth/2, labelY - boxHeight/2, boxWidth, boxHeight, radius);
          ctx.fill();

          ctx.fillStyle = "#fff";
          ctx.fillText(text, labelX, labelY);
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

// 🔥 라운드 박스 함수
function drawRoundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}
