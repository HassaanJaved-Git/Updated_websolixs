"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { SiteContent } from "@/types";
import BiToneHeading from "@/components/ui/BiToneHeading";

gsap.registerPlugin(ScrollTrigger);

interface AboutProps {
  about: SiteContent["about"];
}

export default function AboutSection({ about }: AboutProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // ── Left column: stagger each child
    const textChildren = textRef.current?.children;
    if (textChildren) {
      gsap.fromTo(
        Array.from(textChildren),
        { x: -60, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: textRef.current,
            start: "top 80%",
            once: true,
          },
        }
      );
    }

    // ── Body text: word-by-word reveal
    const body = bodyRef.current;
    if (body) {
      const words = body.textContent?.split(" ") ?? [];
      body.innerHTML = words
        .map((w) => `<span data-word style="opacity:0.2;display:inline;">${w} </span>`)
        .join("");

      gsap.to("[data-word]", {
        opacity: 1,
        stagger: 0.03,
        ease: "none",
        scrollTrigger: {
          trigger: body,
          start: "top 80%",
          end: "bottom 40%",
          scrub: 0.5,
        },
      });
    }

    // ── Right visual
    gsap.fromTo(
      visualRef.current,
      { scale: 0.85, opacity: 0, rotate: 3 },
      {
        scale: 1,
        opacity: 1,
        rotate: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: visualRef.current,
          start: "top 80%",
          once: true,
        },
      }
    );

    // ── Highlights
    gsap.fromTo(
      "[data-highlight]",
      { x: -30, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "[data-highlight]",
          start: "top 85%",
          once: true,
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      aria-labelledby="about-heading"
      className="section-padding relative overflow-hidden"
    >
      {/* Left ambient glow */}
      <div
        aria-hidden="true"
        className="absolute left-[-10%] top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(13,13,26,0.06) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      <div className="container-wide">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Text column */}
          <div ref={textRef}>
            <span className="inline-block text-[11px] font-bold uppercase tracking-[0.25em] text-[var(--color-accent)] mb-4">
              {about.subheading}
            </span>

            <h2
              id="about-heading"
              className="text-[clamp(2.5rem,5vw,4.5rem)] font-black leading-[0.95] tracking-[-0.04em] text-[var(--color-text-primary)] mb-8 whitespace-pre-line"
            >
              <BiToneHeading text={about.heading} />
            </h2>

            <p
              ref={bodyRef}
              className="text-[var(--color-text-secondary)] leading-[1.8] mb-10 text-base"
            >
              {about.body}
            </p>

            <ul className="flex flex-col gap-4" role="list" aria-label="Why choose Websolixs">
              {about.highlights.map((item, i) => (
                <li
                  key={i}
                  data-highlight
                  className="flex items-center gap-4 text-sm text-[var(--color-text-secondary)]"
                >
                  <span
                    className="w-6 h-6 flex items-center justify-center rounded-full bg-[var(--color-accent-dim)] text-[var(--color-accent)] shrink-0"
                    aria-hidden="true"
                  >
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l2.5 2.5 3.5-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Visual column */}
          <div ref={visualRef} className="relative" aria-hidden="true">
            <div className="relative aspect-square max-w-[420px] mx-auto">
              {/* Outer ring */}
              <div
                className="absolute inset-0 rounded-full border border-dashed border-[var(--color-accent)]/20 animate-spin-slow"
              />
              {/* Middle ring */}
              <div
                className="absolute inset-10 rounded-full border border-[var(--color-accent)]/10"
                style={{ animation: "spin-slow 28s linear infinite reverse" }}
              />
              {/* Inner ring */}
              <div
                className="absolute inset-20 rounded-full border border-[rgba(13,13,26,0.06)]"
              />

              {/* Center badge */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="relative w-36 h-36 rounded-3xl flex flex-col items-center justify-center gap-1 border border-[var(--color-border)]"
                  style={{
                    background: "linear-gradient(135deg, var(--color-surface) 0%, var(--color-surface-elevated) 100%)",
                    boxShadow: "0 0 60px rgba(13,13,26,0.08), inset 0 1px 0 rgba(255,255,255,0.5)",
                  }}
                >
                  <span className="text-3xl font-black text-[var(--color-accent)] tracking-tight">WS</span>
                  <span className="text-[10px] uppercase tracking-widest text-[var(--color-text-muted)]">Since 2021</span>
                </div>
              </div>

              {/* Orbit tiles */}
              {[
                { label: "25+", desc: "Engineers", pos: { top: "4%", left: "50%", transform: "translateX(-50%)" } },
                { label: "120+", desc: "Projects", pos: { right: "0%", top: "50%", transform: "translateY(-50%)" } },
                { label: "98%", desc: "Retention", pos: { bottom: "4%", left: "50%", transform: "translateX(-50%)" } },
                { label: "40+", desc: "Clients", pos: { left: "0%", top: "50%", transform: "translateY(-50%)" } },
              ].map((tile, i) => (
                <div
                  key={i}
                  className="absolute px-4 py-3 rounded-xl text-center animate-float"
                  style={{
                    ...tile.pos,
                    animationDelay: `${i * 1.5}s`,
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  <div className="text-lg font-black text-[var(--color-text-primary)] leading-none">{tile.label}</div>
                  <div className="text-[10px] text-[var(--color-text-muted)] mt-0.5">{tile.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
