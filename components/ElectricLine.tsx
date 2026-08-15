"use client";
import { useEffect, useRef } from "react";

export default function ElectricLine() {
  const off1 = useRef<SVGFEOffsetElement>(null);
  const off2 = useRef<SVGFEOffsetElement>(null);
  const off3 = useRef<SVGFEOffsetElement>(null);
  const off4 = useRef<SVGFEOffsetElement>(null);
  const turb1 = useRef<SVGFETurbulenceElement>(null);
  const turb3 = useRef<SVGFETurbulenceElement>(null);

  useEffect(() => {
    let raf = 0;
    let lastSeed = 0;
    const start = performance.now();

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const t = (now - start) / 1000;
      const p = (t % 6) / 6; // même cycle 6s que l'original

      off1.current?.setAttribute("dy", String(700 - p * 700));
      off2.current?.setAttribute("dy", String(-p * 700));
      off3.current?.setAttribute("dx", String(490 - p * 490));
      off4.current?.setAttribute("dx", String(-p * 490));

      // scintillement électrique : nouveau seed toutes les ~120ms
      if (now - lastSeed > 120) {
        lastSeed = now;
        turb1.current?.setAttribute("seed", String(1 + Math.floor(Math.random() * 100)));
        turb3.current?.setAttribute("seed", String(1 + Math.floor(Math.random() * 100)));
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="electric-line" aria-hidden="true">
      <svg className="electric-line-svg">
        <defs>
          <filter id="turbulent-displace" colorInterpolationFilters="sRGB" x="-5%" y="-1500%" width="110%" height="3100%">
            <feTurbulence ref={turb1} type="turbulence" baseFrequency="0.02" numOctaves="4" result="noise1" seed="1" />
            <feOffset ref={off1} in="noise1" dx="0" dy="700" result="offsetNoise1" />
            <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="4" result="noise2" seed="1" />
            <feOffset ref={off2} in="noise2" dx="0" dy="0" result="offsetNoise2" />
            <feTurbulence ref={turb3} type="turbulence" baseFrequency="0.02" numOctaves="4" result="noise3" seed="2" />
            <feOffset ref={off3} in="noise3" dx="490" dy="0" result="offsetNoise3" />
            <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="4" result="noise4" seed="2" />
            <feOffset ref={off4} in="noise4" dx="0" dy="0" result="offsetNoise4" />
            <feComposite in="offsetNoise1" in2="offsetNoise2" result="part1" />
            <feComposite in="offsetNoise3" in2="offsetNoise4" result="part2" />
            <feBlend in="part1" in2="part2" mode="color-dodge" result="combinedNoise" />
            <feDisplacementMap in="SourceGraphic" in2="combinedNoise" scale="30" xChannelSelector="R" yChannelSelector="B" />
          </filter>
        </defs>
      </svg>

      <div className="el-main" />
      <div className="el-glow-1" />
      <div className="el-glow-2" />
      <div className="el-overlay-1" />
      <div className="el-bg-glow" />
    </div>
  );
}