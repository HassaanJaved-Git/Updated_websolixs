"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { SiteContent } from "@/types";

gsap.registerPlugin(ScrollTrigger);

interface TestimonialsProps {
  testimonials: SiteContent["testimonials"];
}

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-1" role="img" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 16 16" fill={i < count ? "var(--color-accent)" : "none"} stroke="var(--color-accent)" strokeWidth="1.5" aria-hidden="true">
          <path d="M8 1l1.854 3.756 4.146.603-3 2.926.708 4.132L8 10.5l-3.708 1.917.708-4.132L2 5.359l4.146-.603z" />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialsSection({ testimonials }: TestimonialsProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.fromTo(
      "[data-testimonial-heading]",
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "[data-testimonial-heading]",
          start: "top 85%",
          once: true,
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // Animate card change
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-testimonial-active]",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }
      );
    }, track);
    return () => ctx.revert();
  }, [active]);

  const item = testimonials.items[active];

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className="section-padding relative bg-[var(--color-bg-secondary)] overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(rgba(200,255,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(200,255,0,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="container-wide relative">
        {/* Heading */}
        <div className="text-center mb-16" data-testimonial-heading>
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-[var(--color-accent)] mb-4">
            Testimonials
          </span>
          <h2
            id="testimonials-heading"
            className="text-[clamp(2.5rem,5vw,4rem)] font-black leading-tight tracking-tight text-[var(--color-text-primary)] mb-4"
          >
            {testimonials.heading}
          </h2>
          <p className="text-[var(--color-text-secondary)] text-lg">{testimonials.subheading}</p>
        </div>

        {/* Active testimonial */}
        <div ref={trackRef} className="max-w-3xl mx-auto mb-10">
          <div data-testimonial-active>
            <blockquote
              className="relative p-10 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] text-center"
              aria-label={`Testimonial from ${item.name}`}
            >
              {/* Quote mark */}
              <div
                aria-hidden="true"
                className="absolute top-6 left-10 text-6xl font-black text-[var(--color-accent)] opacity-20 leading-none select-none"
              >
                "
              </div>
              <StarRating count={item.rating} />
              <p className="text-xl text-[var(--color-text-primary)] leading-relaxed my-8 font-medium">
                "{item.quote}"
              </p>
              <footer className="flex flex-col items-center gap-1">
                <cite className="not-italic font-bold text-[var(--color-text-primary)]">
                  {item.name}
                </cite>
                <span className="text-sm text-[var(--color-text-muted)]">
                  {item.role} — {item.company}
                </span>
              </footer>
            </blockquote>
          </div>
        </div>

        {/* Dot navigation */}
        <div
          className="flex items-center justify-center gap-3"
          role="tablist"
          aria-label="Testimonials navigation"
        >
          {testimonials.items.map((t, i) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={i === active}
              aria-label={`View testimonial from ${t.name}`}
              onClick={() => setActive(i)}
              className="group flex flex-col items-center gap-2 p-2 transition-all duration-300 outline-none"
            >
              <div
                className="w-2 h-2 rounded-full transition-all duration-300"
                style={{
                  background: i === active ? "var(--color-accent)" : "var(--color-border)",
                  transform: i === active ? "scale(1.5)" : "scale(1)",
                }}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
