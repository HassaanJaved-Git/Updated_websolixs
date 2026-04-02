"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let lenisInstance: Lenis | null = null;

export function getLenis(): Lenis | null {
  return lenisInstance;
}

export function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    lenisInstance = lenis;

    // Drive Lenis via GSAP ticker so they share one RAF loop
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // Tell ScrollTrigger to re-calculate on every Lenis scroll event
    lenis.on("scroll", () => ScrollTrigger.update());

    // After Lenis initialises the page layout, refresh all ScrollTrigger positions
    lenis.on("scroll", () => {}); // flush
    window.addEventListener("load", () => {
      ScrollTrigger.refresh();
    });

    // Also refresh after a short delay to catch any async layout
    const t = setTimeout(() => ScrollTrigger.refresh(), 500);

    return () => {
      clearTimeout(t);
      lenis.destroy();
      lenisInstance = null;
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
    };
  }, []);
}
