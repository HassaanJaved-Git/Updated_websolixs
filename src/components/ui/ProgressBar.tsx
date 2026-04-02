"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ProgressBar() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    gsap.to(bar, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: {
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        scrub: 0,
        onUpdate: (self) => {
          bar.style.transform = `scaleX(${self.progress})`;
        },
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div
      ref={barRef}
      aria-hidden="true"
      role="progressbar"
      aria-label="Page scroll progress"
      className="fixed top-0 left-0 right-0 h-[2px] z-[60] origin-left"
      style={{
        background: "var(--color-accent)",
        transform: "scaleX(0)",
        boxShadow: "0 0 10px var(--color-accent)",
      }}
    />
  );
}
