"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TECH_ITEMS = [
  "Next.js", "React", "TypeScript", "Node.js", "Python",
  "PostgreSQL", "MongoDB", "Redis", "AWS", "Docker",
  "Figma", "React Native", "GraphQL", "Tailwind CSS", "Vercel",
];

export default function TechMarquee() {
  const trackRef = useRef<HTMLDivElement>(null);
  const track2Ref = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Scroll-velocity-driven marquee — faster scroll = faster marquee
  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const track2 = track2Ref.current;
    if (!section || !track || !track2) return;

    // Row 1 scrolls left, row 2 scrolls right, both driven by scroll position
    const ctx = gsap.context(() => {
      gsap.to(track, {
        xPercent: -50,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.3,
        },
      });
      gsap.to(track2, {
        xPercent: -25, // starts at -25 so it goes right to left slower
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.5,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const doubled = [...TECH_ITEMS, ...TECH_ITEMS];

  return (
    <div
      ref={sectionRef}
      aria-label="Technologies we work with"
      className="relative overflow-hidden border-y border-[var(--color-border)] bg-[var(--color-surface)] py-5 select-none"
    >
      {/* Edge fades */}
      {["left", "right"].map((side) => (
        <div
          key={side}
          aria-hidden="true"
          className="absolute top-0 bottom-0 w-28 z-10 pointer-events-none"
          style={{
            [side]: 0,
            background: `linear-gradient(${side === "left" ? "90deg" : "270deg"}, var(--color-surface) 0%, transparent 100%)`,
          }}
        />
      ))}

      {/* Row 1 */}
      <div
        ref={trackRef}
        className="flex items-center gap-10 mb-4 whitespace-nowrap"
        style={{ width: "max-content", willChange: "transform" }}
        aria-hidden="true"
      >
        {doubled.map((tech, i) => (
          <span
            key={i}
            className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-muted)] flex items-center gap-4 shrink-0"
          >
            <span className="w-1 h-1 rounded-full bg-[var(--color-accent)] opacity-60" aria-hidden="true" />
            {tech}
          </span>
        ))}
      </div>

      {/* Row 2 — reversed, starts offset */}
      <div
        ref={track2Ref}
        className="flex items-center gap-10 whitespace-nowrap"
        style={{ width: "max-content", transform: "translateX(-25%)", willChange: "transform" }}
        aria-hidden="true"
      >
        {[...doubled].reverse().map((tech, i) => (
          <span
            key={i}
            className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-muted)] flex items-center gap-4 shrink-0"
          >
            <span className="w-1 h-1 rounded-full bg-[var(--color-tertiary)] opacity-40" aria-hidden="true" />
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}
