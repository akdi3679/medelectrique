"use client";
import { useEffect, useRef } from "react";

export default function SparkBolt({ id, x, y, angle, length }: { id: number; x: number; y: number; angle: number; length: number }) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const t0 = performance.now();
    const GROW = 260;
    const tick = (t: number) => {
      const age = t - t0;
      const p = Math.min(1, age / GROW);
      const eased = 1 - Math.pow(1 - p, 3);
      if (trackRef.current) trackRef.current.style.width = `${(length * eased).toFixed(1)}px`;
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [length]);

  return (
    <div ref={trackRef} className="spark" style={{ left: x, top: y, "--rot": `${angle}deg` } as React.CSSProperties}>
      <div className="spark-track spark-glow-2" />
      <div className="spark-track spark-glow-1" />
      <div className="spark-track spark-core" />
    </div>
  );
}