"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { SiteContent } from "@/types";

gsap.registerPlugin(ScrollTrigger);

// Service to image mapping
const SERVICE_IMAGES: Record<string, string> = {
  "web-dev": "web_development.jpg",
  "mobile": "mobile_development.jpg",
  "ui-ux": "UI_design.jpg",
  "cloud": "dev_ops.jpg",
  "ecommerce": "e_commerce.jpg",
  "ai": "ai.jpg",
};

const ICONS: Record<string, React.ReactNode> = {
  Globe: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  Smartphone: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="5" y="2" width="14" height="20" rx="2" /><path d="M12 18h.01" />
    </svg>
  ),
  Layers: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  ),
  Cloud: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
    </svg>
  ),
  ShoppingBag: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  ),
  Cpu: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" /><path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3" />
    </svg>
  ),
};

interface ServicesProps {
  services: SiteContent["services"];
}

export default function ServicesSection({ services }: ServicesProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const imagePaths = services.items.map((service) => {
      const imageName = SERVICE_IMAGES[service.id] || "web_development.jpg";
      return `/images/services/${imageName}`;
    });

    let cancelled = false;
    const preload = () => {
      imagePaths.forEach((src) => {
        const img = new window.Image();
        img.src = src;
        if (img.decode) {
          void img.decode().catch(() => {});
        }
      });
    };

    const idleCallback = (window as Window & {
      requestIdleCallback?: (cb: () => void) => number;
      cancelIdleCallback?: (id: number) => void;
    }).requestIdleCallback;

    const cancelIdleCallback = (window as Window & {
      requestIdleCallback?: (cb: () => void) => number;
      cancelIdleCallback?: (id: number) => void;
    }).cancelIdleCallback;

    let idleId: number | null = null;
    let timeoutId: number | null = null;

    if (idleCallback) {
      idleId = idleCallback(() => {
        if (!cancelled) preload();
      });
    } else {
      timeoutId = window.setTimeout(() => {
        if (!cancelled) preload();
      }, 100);
    }

    return () => {
      cancelled = true;
      if (idleId !== null && cancelIdleCallback) {
        cancelIdleCallback(idleId);
      }
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [services.items]);

  useEffect(() => {
    const section = sectionRef.current;
    const cards = cardsRef.current;
    if (!section || !cards) return;

    // ── Heading: slide in from left + fade ─────────────────────────────
    gsap.fromTo(
      headingRef.current,
      { x: -80, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 85%",
          once: true,
        },
      }
    );

    // ── Section number counter line (scroll-driven width) ──────────────
    gsap.fromTo(
      numberRef.current,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          end: "top 20%",
          scrub: 0.6,
        },
      }
    );

    // ── Cards: garage-door clip-path reveal (bottom → top) ─────────────
    const cardEls = Array.from(cards.querySelectorAll<HTMLElement>("[data-service-card]"));
    cardEls.forEach((card, i) => {
      gsap.set(card, {
        opacity: 0,
        y: 24,
        scale: 0.98,
        willChange: "transform, opacity",
      });

      gsap.to(card, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.65,
        ease: "power3.out",
        delay: (i % 3) * 0.06,
        force3D: true,
        scrollTrigger: {
          trigger: card,
          start: "top 94%",
          once: true,
        },
      });

      const icon = card.querySelector("[data-icon]");
      if (icon) {
        gsap.set(icon, { scale: 0, rotate: -20 });
        gsap.to(icon, {
          scale: 1,
          rotate: 0,
          duration: 0.4,
          ease: "back.out(2)",
          delay: (i % 3) * 0.06 + 0.2,
          scrollTrigger: {
            trigger: card,
            start: "top 94%",
            once: true,
          },
        });
      }
    });

    // Cleanup: only kill ScrollTriggers, NOT the animations themselves
    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        if (section.contains(trigger.trigger as HTMLElement)) {
          trigger.kill();
        }
      });
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="services"
      aria-labelledby="services-heading"
      className="section-padding relative overflow-hidden"
    >
      {/* Right accent glow */}
      <div
        aria-hidden="true"
        className="absolute right-[-10%] top-1/3 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(200,255,0,0.06) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      <div className="container-wide">
        {/* Section label line — scroll-driven */}
        <div
          ref={numberRef}
          aria-hidden="true"
          className="w-full h-px bg-[var(--color-accent)] mb-10 origin-left opacity-30"
        />

        {/* Heading */}
        <div ref={headingRef} className="mb-16 max-w-2xl">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.25em] text-[var(--color-accent)] mb-4">
            What We Build
          </span>
          <h2
            id="services-heading"
            className="text-[clamp(2.5rem,5vw,4.5rem)] font-black leading-[0.95] tracking-[-0.04em] text-[var(--color-text-primary)] mb-5"
          >
            {services.heading}
          </h2>
          <p className="text-[var(--color-text-secondary)] text-lg leading-relaxed">
            {services.subheading}
          </p>
        </div>

        {/* Cards grid */}
        <div
          ref={cardsRef}
          role="list"
          aria-label="Our services"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {services.items.map((service, i) => {
            const imagePath = SERVICE_IMAGES[service.id] || "web_development.jpg";
            const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
              const card = e.currentTarget;
              const rect = card.getBoundingClientRect();
              const x = ((e.clientX - rect.left) / rect.width) * 100;
              const y = ((e.clientY - rect.top) / rect.height) * 100;
              card.style.setProperty("--mx", `${x}%`);
              card.style.setProperty("--my", `${y}%`);
            };

            return (
            <article
              key={service.id}
              data-service-card
              role="listitem"
              className="group relative p-7 rounded-2xl border border-[var(--color-border)] cursor-pointer overflow-hidden transition-all duration-300 hover:border-[rgba(200,255,0,0.3)]"
              onMouseMove={handleMouseMove}
              style={{
                backgroundImage: `url(/images/services/${imagePath})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                willChange: "transform, opacity",
              }}
            >
              {/* Background image overlay for text readability */}
              <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "linear-gradient(135deg, rgba(13,13,26,0.80) 0%, rgba(13,13,26,0.70) 50%, rgba(13,13,26,0.80) 100%)",
                }}
              />

              {/* White overlay on hover */}
              <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none transition-opacity duration-500 opacity-0 group-hover:opacity-100"
                style={{
                  background: "radial-gradient(circle at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.15) 25%, rgba(255,255,255,0.05) 50%, transparent 80%)",
                }}
              />

              {/* Animated background glow on hover */}
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse 70% 70% at 50% 10%, rgba(200,255,0,0.07) 0%, transparent 70%)",
                }}
              />

              {/* Top shimmer line */}
              <div
                aria-hidden="true"
                className="absolute top-0 left-[-100%] w-full h-px group-hover:left-0 transition-all duration-700 ease-out pointer-events-none"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(200,255,0,0.6), transparent)",
                }}
              />

              {/* Content wrapper — positioned relative to overlay */}
              <div className="relative z-10">
                {/* Index number */}
                <span
                  aria-hidden="true"
                  className="absolute top-0 right-0 text-[11px] font-bold text-white tabular-nums"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* Icon */}
                <div
                  data-icon
                  className="w-11 h-11 flex items-center justify-center rounded-xl bg-[var(--color-accent-dim)] text-white mb-6 group-hover:bg-[var(--color-accent)] group-hover:text-[var(--color-bg)] transition-all duration-300"
                  aria-hidden="true"
                >
                  {ICONS[service.icon] ?? ICONS.Globe}
                </div>

                {/* Content */}
                <h3 className="text-[1.15rem] font-bold text-white mb-3 transition-colors duration-300 leading-snug">
                  {service.title}
                </h3>
                <p className="text-sm text-[rgba(255,255,255,0.85)] leading-relaxed mb-6">
                  {service.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5" role="list" aria-label={`Technologies used in ${service.title}`}>
                  {service.tags.map((tag) => (
                    <span
                      key={tag}
                      role="listitem"
                      className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[rgba(13,13,26,0.6)] border border-[rgba(200,255,0,0.2)] text-white"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Hover arrow */}
                <div
                  aria-hidden="true"
                  className="absolute bottom-0 right-0 w-7 h-7 rounded-full border border-[var(--color-accent)] flex items-center justify-center text-[var(--color-accent)] opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
