import React from "react";
import bgUrl from "../assets/images/main-background.svg";

export default function MainPage() {
  return (
    <div 
      className="fixed inset-0 bg-white overflow-hidden"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}
    >
      {/* 고정 크기 게임 뷰포트 - 완벽한 중앙 정렬, 항상 여백 유지 */}
      <div 
        className="relative bg-black overflow-hidden"
        style={{
          width: '1200px',
          height: '675px',
          maxWidth: 'calc(100vw - 4rem)',
          maxHeight: 'calc(100vh - 4rem)',
          aspectRatio: '16/9',
          margin: 'auto',
          position: 'relative'
        }}
      >
        {/* 배경 이미지 - 잘리거나 늘어나지 않도록 object-contain 사용 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src={bgUrl}
            alt="background"
            className="block max-w-full max-h-full w-auto h-auto object-contain select-none pointer-events-none"
            draggable={false}
            style={{
              objectFit: 'contain'
            }}
          />
        </div>
        
        {/* 게임 요소들을 여기에 배치 - 뷰포트 안에서만 실행 */}
        <div className="relative z-10 w-full h-full">
          {/* 게임 요소들을 여기에 추가 */}
        </div>
      </div>
    </div>
  );
}
