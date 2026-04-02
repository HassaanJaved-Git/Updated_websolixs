"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { HeroContent } from "@/types";

gsap.registerPlugin(ScrollTrigger);

// ─── Canvas particle system ────────────────────────────────────────────────
function initCanvas(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d")!;
  if (!ctx) return () => {};

  let W = (canvas.width = window.innerWidth);
  let H = (canvas.height = window.innerHeight);
  let raf = 0;

  const ACCENT = "13,13,26";
  const CYAN = "224,232,255";

  interface Dot {
    x: number; y: number; vx: number; vy: number;
    r: number; color: string; opacity: number; oDir: number;
  }

  const COUNT = Math.min(Math.floor((W * H) / 18000), 80);
  const dots: Dot[] = Array.from({ length: COUNT }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    r: Math.random() * 1.5 + 0.5,
    color: Math.random() > 0.5 ? ACCENT : CYAN,
    opacity: Math.random() * 0.4 + 0.1,
    oDir: Math.random() > 0.5 ? 1 : -1,
  }));

  let mouse = { x: -9999, y: -9999 };
  const onMouse = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };
  window.addEventListener("mousemove", onMouse, { passive: true });

  const onResize = () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  };
  window.addEventListener("resize", onResize, { passive: true });

  const LINE_DIST = 120;
  const MOUSE_DIST = 160;

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Update positions
    dots.forEach((d) => {
      d.x += d.vx;
      d.y += d.vy;
      if (d.x < 0 || d.x > W) d.vx *= -1;
      if (d.y < 0 || d.y > H) d.vy *= -1;
      d.opacity += d.oDir * 0.003;
      if (d.opacity >= 0.5 || d.opacity <= 0.05) d.oDir *= -1;
    });

    // Draw connections
    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        const dx = dots[i].x - dots[j].x;
        const dy = dots[i].y - dots[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < LINE_DIST) {
          const alpha = (1 - dist / LINE_DIST) * 0.12;
          ctx.beginPath();
          ctx.moveTo(dots[i].x, dots[i].y);
          ctx.lineTo(dots[j].x, dots[j].y);
          ctx.strokeStyle = `rgba(${dots[i].color},${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
      // Mouse interaction — repel dots towards mouse
      const mdx = dots[i].x - mouse.x;
      const mdy = dots[i].y - mouse.y;
      const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
      if (mdist < MOUSE_DIST) {
        const force = (MOUSE_DIST - mdist) / MOUSE_DIST;
        const angle = Math.atan2(mdy, mdx);
        ctx.beginPath();
        ctx.moveTo(dots[i].x, dots[i].y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = `rgba(${dots[i].color},${force * 0.25})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
        dots[i].x += Math.cos(angle) * force * 0.8;
        dots[i].y += Math.sin(angle) * force * 0.8;
      }
    }

    // Draw dots
    dots.forEach((d) => {
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${d.color},${d.opacity})`;
      ctx.fill();
    });

    raf = requestAnimationFrame(draw);
  }

  draw();

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("mousemove", onMouse);
    window.removeEventListener("resize", onResize);
  };
}

// ─── Split text into spans for char animation ─────────────────────────────
function SplitChars({ text, className }: { text: string; className?: string }) {
  return (
    <span className={className} aria-label={text}>
      {text.split("").map((ch, i) => (
        <span
          key={i}
          data-char
          aria-hidden="true"
          style={{ display: "inline-block", willChange: "transform, opacity" }}
        >
          {ch === " " ? "\u00A0" : ch}
        </span>
      ))}
    </span>
  );
}

// ─── Component ────────────────────────────────────────────────────────────
interface HeroProps {
  hero: HeroContent;
}

export default function HeroSection({ hero }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const titleLine1Ref = useRef<HTMLDivElement>(null);
  const titleLine2Ref = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  // Canvas init
  useEffect(() => {
    if (!canvasRef.current) return;
    return initCanvas(canvasRef.current);
  }, []);

  // Entrance animations — char-split stagger
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.5 });

      // Badge slide down + fade
      tl.fromTo(
        badgeRef.current,
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" }
      );

      // Title line 1 — chars cascade in
      const chars1 = titleLine1Ref.current?.querySelectorAll("[data-char]") ?? [];
      tl.fromTo(
        chars1,
        { y: 80, rotateX: -60, opacity: 0 },
        { y: 0, rotateX: 0, opacity: 1, duration: 0.7, stagger: 0.03, ease: "power4.out" },
        "-=0.3"
      );

      // Title line 2 — highlighted, bigger stagger
      const chars2 = titleLine2Ref.current?.querySelectorAll("[data-char]") ?? [];
      tl.fromTo(
        chars2,
        { y: 100, rotateX: -80, opacity: 0 },
        { y: 0, rotateX: 0, opacity: 1, duration: 0.7, stagger: 0.04, ease: "power4.out" },
        "-=0.5"
      );

      // Subtitle — reveal via clip
      tl.fromTo(
        subRef.current,
        { clipPath: "inset(0 100% 0 0)", opacity: 0 },
        { clipPath: "inset(0 0% 0 0)", opacity: 1, duration: 1, ease: "power3.out" },
        "-=0.3"
      );

      // CTAs — pop in with spring
      tl.fromTo(
        ctaRef.current?.children ?? [],
        { scale: 0.8, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "back.out(1.7)" },
        "-=0.5"
      );

      // Stats — slide up stagger
      tl.fromTo(
        statsRef.current?.children ?? [],
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: "power3.out" },
        "-=0.3"
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Scroll-linked bidirectional parallax
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Grid drift down as we scroll out
      gsap.to(gridRef.current, {
        yPercent: 40,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 0.5,
        },
      });

      // Orb 1 — drifts up & fades
      gsap.to(orbRef.current, {
        yPercent: -70,
        xPercent: 15,
        scale: 0.4,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "70% top",
          scrub: 1,
        },
      });

      // Orb 2 — opposite drift
      gsap.to(orb2Ref.current, {
        yPercent: -50,
        xPercent: -20,
        scale: 0.5,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "70% top",
          scrub: 1.4,
        },
      });

      // Content — scroll away upward
      gsap.to(contentRef.current, {
        yPercent: 25,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "20% top",
          end: "75% top",
          scrub: 0.8,
        },
      });

      // Canvas — slow parallax (depth effect)
      gsap.to(canvasRef.current, {
        yPercent: 15,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 2,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      aria-label="Hero"
      className="relative min-h-[100svh] flex items-center overflow-hidden"
    >
      {/* Canvas particle background */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 w-full h-full z-0 pointer-events-none"
      />

      {/* Background layers */}
      <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
        {/* Grid lines */}
        <div
          ref={gridRef}
          className="absolute inset-0"
          style={{
            backgroundImage: [
              "linear-gradient(rgba(13,13,26,0.05) 1px, transparent 1px)",
              "linear-gradient(90deg, rgba(13,13,26,0.05) 1px, transparent 1px)",
            ].join(","),
            backgroundSize: "80px 80px",
          }}
        />

        {/* Top center glow */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% -5%, rgba(13,13,26,0.12) 0%, transparent 70%)",
          }}
        />

        {/* Orb 1 — dark navy */}
        <div
          ref={orbRef}
          className="absolute top-[-15%] left-[15%] w-[600px] h-[600px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(13,13,26,0.18) 0%, rgba(13,13,26,0.04) 45%, transparent 70%)",
            filter: "blur(40px)",
            animation: "pulse-glow 4s ease-in-out infinite",
          }}
        />

        {/* Orb 2 — light blue */}
        <div
          ref={orb2Ref}
          className="absolute top-[5%] right-[5%] w-[450px] h-[450px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(224,232,255,0.12) 0%, rgba(224,232,255,0.03) 45%, transparent 70%)",
            filter: "blur(50px)",
            animation: "pulse-glow 5s ease-in-out infinite 1.5s",
          }}
        />

        {/* Decorative rotating ring */}
        <svg
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] opacity-[0.04] animate-spin-slow"
          viewBox="0 0 900 900"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="450" cy="450" r="430" stroke="url(#hg1)" strokeWidth="1" strokeDasharray="12 20" />
          <circle cx="450" cy="450" r="320" stroke="url(#hg1)" strokeWidth="0.6" strokeDasharray="6 14" />
          <circle cx="450" cy="450" r="200" stroke="url(#hg1)" strokeWidth="0.4" strokeDasharray="3 10" />
          <defs>
            <linearGradient id="hg1" x1="0" y1="0" x2="900" y2="900">
              <stop stopColor="#0D0D1A" />
              <stop offset="1" stopColor="#e0e8ff" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Main content */}
      <div ref={contentRef} className="container-wide relative z-10 pt-32 pb-16" style={{ perspective: "800px" }}>
        {/* Badge */}
        <div
          ref={badgeRef}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(200,255,0,0.3)] bg-[rgba(200,255,0,0.06)] mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] animate-pulse" aria-hidden="true" />
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-accent)]">
            {hero.badge}
          </span>
        </div>

        {/* Animated title */}
        <div className="mb-6 overflow-hidden" style={{ perspective: "600px" }}>
          <h1 className="text-[clamp(3.2rem,8.5vw,7.5rem)] font-black leading-[0.92] tracking-[-0.04em]">
            <div ref={titleLine1Ref} style={{ overflow: "hidden" , height: "1.1em"
            }}>
              <SplitChars
                text={hero.title}
                className="block text-[var(--color-text-primary)]"
              />
            </div>
            <div ref={titleLine2Ref} style={{ overflow: "hidden" }}>
              <SplitChars
                text={hero.titleHighlight}
                className="block text-gradient"
              />
            </div>
          </h1>
        </div>

        {/* Subtitle */}
        <p
          ref={subRef}
          className="max-w-lg text-[clamp(1rem,1.4vw,1.2rem)] text-[var(--color-text-secondary)] leading-relaxed mb-10"
          style={{ willChange: "clip-path, opacity" }}
        >
          {hero.subtitle}
        </p>

        {/* CTAs */}
        <div ref={ctaRef} className="flex flex-wrap items-center gap-4 mb-20">
          <a
            href={hero.ctaPrimary.href}
            onClick={(e) => {
              e.preventDefault();
              document.querySelector(hero.ctaPrimary.href)?.scrollIntoView({ behavior: "smooth" });
            }}
            className="magnetic group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[var(--color-accent)] text-[var(--color-bg)] font-bold text-sm overflow-hidden transition-all duration-300 hover:gap-4 hover:shadow-[0_0_50px_rgba(200,255,0,0.4)]"
            data-cursor-hover
          >
            <span className="relative z-10">{hero.ctaPrimary.label}</span>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="relative z-10" aria-hidden="true">
              <path d="M3 9h12M11 5l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {/* Shimmer */}
            <span
              aria-hidden="true"
              className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]"
            />
          </a>

          <a
            href={hero.ctaSecondary.href}
            onClick={(e) => {
              e.preventDefault();
              document.querySelector(hero.ctaSecondary.href)?.scrollIntoView({ behavior: "smooth" });
            }}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full border border-[rgba(255,255,255,0.12)] text-[var(--color-text-secondary)] font-semibold text-sm hover:border-[rgba(255,255,255,0.3)] hover:text-[var(--color-text-primary)] transition-all duration-300"
            data-cursor-hover
          >
            {hero.ctaSecondary.label}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="opacity-50">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

        {/* Stats */}
        <div
          ref={statsRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-[var(--color-border)] pt-10"
          role="list"
          aria-label="Company statistics"
        >
          {hero.stats.map((stat, i) => (
            <div key={i} role="listitem" className="group flex flex-col gap-1">
              <span className="text-[clamp(1.8rem,3vw,2.5rem)] font-black text-[var(--color-text-primary)] tracking-tight leading-none group-hover:text-[var(--color-accent)] transition-colors duration-300">
                {stat.value}
              </span>
              <span className="text-sm text-[var(--color-text-muted)]">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom fade */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[var(--color-bg)] to-transparent z-10 pointer-events-none"
      />

      {/* Scroll indicator */}
      <div
        aria-label="Scroll to explore"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none"
      >
        <span className="text-[10px] uppercase tracking-[0.25em] text-[var(--color-text-muted)]">
          Scroll
        </span>
        <div className="relative w-5 h-8 rounded-full border border-[var(--color-border)] flex justify-center pt-1.5" aria-hidden="true">
          <span className="w-0.5 h-2 rounded-full bg-[var(--color-accent)] animate-bounce" />
        </div>
      </div>
    </section>
  );
}
