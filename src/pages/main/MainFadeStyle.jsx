import React from "react";

export default function MainFadeStyle() {
  return (
    <style>
      {`
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateX(-50%) translateY(20px); }
          100% { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        .fade-item {
          opacity: 0;
          animation: fadeIn 1.2s ease-out forwards;
        }
      `}
    </style>
  );
}
