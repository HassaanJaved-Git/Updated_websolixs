"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { SiteContent } from "@/types";

gsap.registerPlugin(ScrollTrigger);

interface StatsProps {
  stats: SiteContent["stats"];
}

export default function StatsSection({ stats }: StatsProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // ── Sweep line
    gsap.fromTo(
      "[data-sweep]",
      { scaleX: 0, transformOrigin: "left center" },
      {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
          end: "top 20%",
          scrub: 0.4,
        },
      }
    );

    // ── Heading reveal
    gsap.fromTo(
      "[data-stats-heading]",
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "[data-stats-heading]",
          start: "top 88%",
          once: true,
        },
      }
    );

    // ── Cards
    const cards = section.querySelectorAll("[data-stat-card]");
    gsap.fromTo(
      cards,
      { y: 60, opacity: 0, scale: 0.9 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          once: true,
        },
      }
    );

    // ── Animated number counters
    const counters = section.querySelectorAll<HTMLElement>("[data-count]");
    counters.forEach((el) => {
      const target = parseInt(el.dataset.count ?? "0", 10);
      const obj = { val: 0 };

      gsap.to(obj, {
        val: target,
        duration: 2.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
          once: true,
        },
        onUpdate() {
          el.textContent = Math.round(obj.val).toString();
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="stats"
      aria-labelledby="stats-heading"
      className="section-padding relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, var(--color-bg) 0%, var(--color-surface) 50%, var(--color-bg) 100%)",
      }}
    >
      {/* Sweep line */}
      <div
        data-sweep
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent"
      />

      <div className="container-wide">
        <h2
          id="stats-heading"
          data-stats-heading
          className="text-[11px] font-bold uppercase tracking-[0.25em] text-[var(--color-accent)] text-center mb-14"
        >
          {stats.heading}
        </h2>

        <div
          role="list"
          aria-label="Company statistics"
          className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--color-border)] rounded-2xl overflow-hidden"
        >
          {stats.items.map((stat, i) => (
            <div
              key={i}
              data-stat-card
              role="listitem"
              className="group relative bg-[var(--color-surface)] p-8 md:p-12 flex flex-col gap-3 overflow-hidden hover:bg-[var(--color-surface-elevated)] transition-colors duration-300"
            >
              {/* Corner accent */}
              <div
                aria-hidden="true"
                className="absolute top-0 right-0 w-16 h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background:
                    "radial-gradient(circle at top right, rgba(13,13,26,0.1) 0%, transparent 70%)",
                }}
              />

              <div className="relative flex items-end gap-1">
                <span
                  className="text-[clamp(3rem,5vw,4.5rem)] font-black leading-none tracking-tight text-[var(--color-text-primary)] tabular-nums"
                  data-count={stat.value}
                  aria-label={`${stat.value}${stat.suffix}`}
                >
                  {stat.value}
                </span>
                <span className="text-[clamp(1.5rem,3vw,2.5rem)] font-black text-[var(--color-accent)] leading-none pb-1">
                  {stat.suffix}
                </span>
              </div>

              <p className="text-base font-bold text-[var(--color-text-primary)]">{stat.label}</p>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">{stat.description}</p>

              {/* Bottom accent line on hover */}
              <div
                aria-hidden="true"
                className="absolute bottom-0 left-0 w-0 h-[2px] bg-[var(--color-accent)] group-hover:w-full transition-all duration-500"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
