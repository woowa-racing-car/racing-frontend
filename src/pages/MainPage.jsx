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
      {}
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
        {}
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
        
        {}
        <div className="relative z-10 w-full h-full">
          {}
        </div>
      </div>
    </div>
  );
}