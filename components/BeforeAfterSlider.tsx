"use client";
import { useState } from 'react';

export default function BeforeAfterSlider({ beforeImage, afterImage, beforeLabel, afterLabel }: any) {
  const [pos, setPos] = useState(50);
  return (
    <div className="relative w-full aspect-video overflow-hidden rounded-xl select-none">
      <img src={afterImage} alt="After" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
        <img src={beforeImage} alt="Before" className="w-full h-full object-cover" style={{ width: `${100 / (pos / 100)}%`, maxWidth: 'none' }} />
      </div>
      <div className="absolute top-0 bottom-0 w-1 bg-primary cursor-ew-resize" style={{ left: `${pos}%` }}
        onMouseDown={(e) => {
          const rect = (e.currentTarget.parentNode as HTMLElement).getBoundingClientRect();
          const move = (ev: MouseEvent) => setPos(Math.max(0, Math.min(100, ((ev.clientX - rect.left) / rect.width) * 100)));
          const up = () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up); };
          window.addEventListener('mousemove', move);
          window.addEventListener('mouseup', up);
        }}
      />
      <span className="absolute top-4 left-4 px-3 py-1 bg-background/80 rounded text-xs font-semibold">{beforeLabel}</span>
      <span className="absolute top-4 right-4 px-3 py-1 bg-background/80 rounded text-xs font-semibold">{afterLabel}</span>
    </div>
  );
}