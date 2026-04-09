"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { SiteContent } from "@/types";

gsap.registerPlugin(ScrollTrigger);

interface UseCasesSectionProps {
  useCases: SiteContent["useCases"];
}

// Enhanced animated background with gradient mesh
function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      opacity: number;
      targetOpacity: number;
    }> = [];

    // Create particles with more complex behavior
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        radius: Math.random() * 1.5 + 0.5,
        opacity: 0,
        targetOpacity: Math.random() * 0.3 + 0.1,
      });
    }

    function animate() {
      if (!ctx || !canvas) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Smoothly transition opacity
        particle.opacity += (particle.targetOpacity - particle.opacity) * 0.02;

        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Gradient color effect
        const hue = (particle.x / canvas.width) * 360;
        ctx.fillStyle = `hsla(${hue}, 100%, 50%, ${particle.opacity * 0.15})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    }

    animationRef.current = requestAnimationFrame(animate);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 opacity-30" suppressHydrationWarning />;
}

const iconMap: Record<string, React.ReactNode> = {
  Lightbulb: (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  Palette: (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="8" r="1" />
      <circle cx="16" cy="12" r="1" />
      <circle cx="12" cy="16" r="1" />
      <circle cx="8" cy="12" r="1" />
    </svg>
  ),
  Code: (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  Rocket: (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 16.5c-1.5-1.5-2-5-2-5s3.5-.5 5-2" />
      <path d="M19.5 7.5c1.5 1.5 2 5 2 5s-3.5.5-5 2" />
      <circle cx="12" cy="12" r="1" />
      <path d="M12 1v6m0 6v6" />
      <path d="M4.22 4.22l4.24 4.24m6.08 0l4.24-4.24" />
    </svg>
  ),
  Shield: (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
};

export default function UseCasesSection({ useCases }: UseCasesSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const section = sectionRef.current;
    if (!section) return;

    // Animate section heading with improved easing
    gsap.fromTo(
      "[data-usecase-heading]",
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "cubic-bezier(0.34, 1.56, 0.64, 1)",
        scrollTrigger: {
          trigger: "[data-usecase-heading]",
          start: "top 85%",
          once: true,
        },
      }
    );

    // Enhance timeline animations
    gsap.fromTo(
      "[data-timeline-accent]",
      { scaleY: 0, opacity: 0 },
      {
        scaleY: 1,
        opacity: 1,
        duration: 1.5,
        ease: "cubic-bezier(0.34, 1.56, 0.64, 1)",
        transformOrigin: "top",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 50%",
          once: true,
        },
      }
    );

    // Animate each card with enhanced 3D effects
    cardsRef.current.forEach((card, index) => {
      if (!card) return;
      
      const isLeftCard = index % 2 !== 0; // Odd = left, Even = right

      // Main card entrance with directional slide and 3D rotation
      gsap.fromTo(
        card,
        {
          opacity: 0,
          x: isLeftCard ? -90 : 90,
          y: 50,
          rotateX: 16,
          rotateY: isLeftCard ? -14 : 14,
        },
        {
          opacity: 1,
          x: 0,
          y: 0,
          rotateX: 0,
          rotateY: 0,
          duration: 0.85,
          ease: "cubic-bezier(0.34, 1.56, 0.64, 1)",
          delay: index * 0.08,
          scrollTrigger: {
            trigger: card,
            start: "top 96%",
            once: true,
          },
        }
      );

      // Animate accent border with directional scaling
      gsap.fromTo(
        card.querySelector("[data-accent-border]"),
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.7,
          ease: "power3.out",
          delay: index * 0.08 + 0.12,
          transformOrigin: isLeftCard ? "left" : "right",
          scrollTrigger: {
            trigger: card,
            start: "top 96%",
            once: true,
          },
        }
      );

      // Animate icon with directional rotation
      gsap.fromTo(
        card.querySelector("[data-usecase-icon]"),
        { opacity: 0, scale: 0, rotateZ: isLeftCard ? -360 : 360 },
        {
          opacity: 1,
          scale: 1,
          rotateZ: 0,
          duration: 0.7,
          ease: "cubic-bezier(0.34, 1.56, 0.64, 1)",
          delay: index * 0.08 + 0.05,
          scrollTrigger: {
            trigger: card,
            start: "top 96%",
            once: true,
          },
        }
      );

      // Animate content elements with directional offset
      gsap.fromTo(
        card.querySelectorAll("[data-usecase-content]"),
        { opacity: 0, x: isLeftCard ? -50 : 50, y: 30 },
        {
          opacity: 1,
          x: 0,
          y: 0,
          duration: 0.55,
          stagger: 0.07,
          ease: "power3.out",
          delay: index * 0.08 + 0.12,
          scrollTrigger: {
            trigger: card,
            start: "top 96%",
            once: true,
          },
        }
      );

      // Enhanced hover interactions with directional effects
      card.addEventListener("mouseenter", () => {
        setHoveredIndex(index);
        
        // gsap.to(card, {
        //   y: -25,
        //   x: isLeftCard ? -15 : 15,
        //   boxShadow: `0 50px 100px rgba(13, 13, 26, 0.2), inset 0 1px 0 rgba(255,255,255,0.5)`,
        //   duration: 0.5,
        //   ease: "power2.out",
        // });

        gsap.to(card.querySelector("[data-accent-border]"), {
          opacity: 1,
          scaleX: 1.2,
          duration: 0.4,
        });

        gsap.to(card.querySelector("[data-usecase-icon-box]"), {
          scale: 1.2,
          boxShadow: `0 25px 50px ${useCases.items[index].color}50`,
          duration: 0.5,
        });

        gsap.to(card.querySelector("[data-usecase-icon]"), {
          rotateZ: isLeftCard ? -360 : 360,
          duration: 0.8,
          ease: "power2.out",
        });
      });

      card.addEventListener("mouseleave", () => {
        setHoveredIndex(null);
        
        // gsap.to(card, {
        //   y: 0,
        //   x: 0,
        //   // boxShadow: "0 4px 12px rgba(13, 13, 26, 0.05)",
        //   duration: 0.5,
        //   ease: "power2.out",
        // });

        gsap.to(card.querySelector("[data-accent-border]"), {
          opacity: 0.5,
          scaleX: 1,
          duration: 0.4,
        });

        gsap.to(card.querySelector("[data-usecase-icon-box]"), {
          scale: 1,
          boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
          duration: 0.5,
        });
      });

      // Parallax effect on scroll
      gsap.to(card, {
        y: isLeftCard ? -30 : 30,
        scrollTrigger: {
          trigger: card,
          start: "top 50%",
          end: "bottom 50%",
          scrub: 1,
          onUpdate: (self) => setScrollProgress(self.progress),
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [isClient, useCases.items]);


  return (
    <section
      ref={sectionRef}
      id="use-cases"
      aria-labelledby="use-cases-heading"
      suppressHydrationWarning
      className="section-padding relative bg-[var(--color-bg)] overflow-hidden perspective"
      style={{ perspective: "1200px" }}
    >
      {/* Enhanced animated background - Client only */}
      {isClient && <AnimatedBackground />}

      {/* Gradient overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(13, 13, 26, 0.02) 0%, transparent 50%)",
        }}
      />

      {/* Grid background with subtle pattern */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(13, 13, 26, 1) 1px, transparent 1px), linear-gradient(90deg, rgba(13, 13, 26, 1) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <div className="container-wide relative z-10">
        {/* Heading Section with enhanced styling */}
        <div className="text-center mb-20 lg:mb-32" data-usecase-heading>
          <span className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-[var(--color-accent)]bg-opacity-5 border border-[var(--color-accent)]/10 text-xs font-bold uppercase tracking-widest text-[var(--color-accent)] mb-6">
            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-text-secondary)] mr-2"></span>
            Our Process
          </span>
          <h2
            id="use-cases-heading"
            className="text-[clamp(2.8rem,6vw,4.5rem)] font-black leading-tight tracking-tight text-[var(--color-text-primary)] mb-6 max-w-4xl mx-auto"
          >
            {useCases.heading.split(" ").map((word, idx) => (
              <span key={idx}>
                {word}{" "}
              </span>
            ))}
          </h2>
          <p className="text-[var(--color-text-secondary)] text-lg max-w-3xl mx-auto leading-relaxed">
            {useCases.subheading}
          </p>
        </div>

        {/* Main Timeline Container */}
        <div ref={containerRef} className="relative max-w-5xl mx-auto">
          {/* Animated vertical accent line */}
          <div
            data-timeline-accent
            className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-[var(--color-accent)] via-[var(--color-accent)]/50 to-transparent origin-top"
            aria-hidden="true"
            style={{
              background:
                "linear-gradient(to bottom, var(--color-accent), rgba(13, 13, 26, 0.2), transparent)",
            }}
          />

          <div className="space-y-6 lg:space-y-10">
            {useCases.items.map((useCase, index) => (
              <div
                key={useCase.id}
                ref={(el) => {
                  if (el) cardsRef.current[index] = el;
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="group relative flex gap-0 lg:gap-8 items-stretch min-h-[310px] lg:min-h-auto lg:flex-row"
                style={{
                  perspective: "1000px",
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Timeline Dot - Enhanced */}
                <div className="absolute left-1/2 -translate-x-1/2 top-0 w-0 h-full flex items-start justify-center pointer-events-none">
                  <div
                    className="w-6 h-6 rounded-full border-4 border-[var(--color-bg)] z-20 mt-10 shadow-lg transition-all duration-300"
                    style={{
                      backgroundColor: useCase.color,
                      boxShadow:
                        hoveredIndex === index
                          ? `0 0 30px ${useCase.color}, 0 0 60px ${useCase.color}60`
                          : `0 0 15px ${useCase.color}60`,
                    }}
                    aria-hidden="true"
                  />
                  {/* Connector line from timeline to card */}
                  <div
                    className="absolute top-6 transition-all duration-300"
                    style={{
                      [index % 2 !== 0 ? "left" : "right"]: "100%",
                      width: "calc(50% - 16px)",
                      height: "2px",
                      background: `linear-gradient(to ${index % 2 !== 0 ? "left" : "right"}, ${useCase.color}60, transparent)`,
                      opacity: hoveredIndex === index ? 1 : 0.3,
                    }}
                    aria-hidden="true"
                  />
                </div>

                {/* Card Content - Modern Design */}
                <div className={`w-full lg:w-1/2 pt-6 lg:pt-0 ${index % 2 === 0 ? "lg:ml-auto" : ""}`}>
                  <div
                    className="group relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white/40 backdrop-blur-sm p-8 lg:p-10 transition-all duration-300 hover:border-[var(--color-accent)] h-full hover:bg-white/60"
                    // style={{
                    //   boxShadow:
                    //     hoveredIndex === index
                    //       ? `0 30px 60px rgba(13, 13, 26, 0.12), inset 0 1px 0 rgba(255,255,255,0.8)`
                    //       : "0 4px 12px rgba(13, 13, 26, 0.05)",
                    // }}
                  >
                    {/* Top accent border - Directional */}
                    <div
                      data-accent-border
                      className="absolute top-0 h-1 transition-all duration-300"
                      style={{ 
                        width: "60%",
                        [index % 2 !== 0 ? "left" : "right"]: "0",
                        background: `linear-gradient(to ${index % 2 !== 0 ? "right" : "left"}, ${useCase.color}, transparent)`,
                        opacity: 0.5,
                      }}
                      aria-hidden="true"
                    />

                    {/* Animated background gradient */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background: `radial-gradient(ellipse at 50% 0%, ${useCase.color}08, transparent 80%)`,
                      }}
                      aria-hidden="true"
                    />

                    {/* Animated shine effect - Directional */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{
                        background: `linear-gradient(${index % 2 !== 0 ? "90deg" : "-90deg"}, transparent, rgba(255,255,255,0.5), transparent)`,
                        transform: hoveredIndex === index ? (index % 2 !== 0 ? "translateX(100%)" : "translateX(-100%)") : (index % 2 !== 0 ? "translateX(-100%)" : "translateX(100%)"),
                        animation:
                          hoveredIndex === index
                            ? `shimmer-${index % 2 !== 0 ? "right" : "left"} 0.7s ease-in-out`
                            : "none",
                      }}
                      aria-hidden="true"
                    />

                    <div className="relative z-10 space-y-6">
                      {/* Number and Icon Row */}
                      <div className="flex items-start justify-between gap-4">
                        {/* Icon with enhanced styling */}
                        <div
                          data-usecase-icon-box
                          className="flex items-center justify-center w-20 h-20 rounded-2xl transition-all duration-300 flex-shrink-0"
                          style={{
                            backgroundColor: `${useCase.color}12`,
                            border: `2px solid ${useCase.color}30`,
                            boxShadow:
                              hoveredIndex === index
                                ? `0 12px 24px ${useCase.color}25`
                                : "0 4px 8px rgba(0,0,0,0.05)",
                          }}
                        >
                          <div
                            data-usecase-icon
                            style={{ color: useCase.color }}
                            className="transition-transform duration-300"
                          >
                            {iconMap[useCase.icon] || iconMap.Lightbulb}
                          </div>
                        </div>

                        {/* Large number - Step counter */}
                        <div className="text-right flex-shrink-0">
                          <div
                            className="text-7xl lg:text-8xl font-black leading-none transition-all duration-300"
                            style={{
                              color: useCase.color,
                              opacity:
                                hoveredIndex === index ? 0.3 : 0.12,
                            }}
                          >
                            {String(useCase.number).padStart(2, "0")}
                          </div>
                        </div>
                      </div>

                      {/* Title and Description */}
                      <div data-usecase-content>
                        <h3 className="text-2xl lg:text-3xl font-bold text-[var(--color-text-primary)] mb-3 leading-tight">
                          {useCase.title}
                        </h3>
                        <p className="text-[var(--color-text-secondary)] text-base leading-relaxed">
                          {useCase.description}
                        </p>
                      </div>

                      {/* Challenge, Solution, Result sections */}
                      <div className="space-y-5 pt-6 border-t border-[var(--color-border)]">
                        {/* Challenge */}
                        <div data-usecase-content>
                          <div className="flex items-center gap-2 mb-2">
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: useCase.color }}
                            />
                            <h4
                              className="text-xs font-bold uppercase tracking-widest"
                              style={{ color: useCase.color }}
                            >
                              Challenge
                            </h4>
                          </div>
                          <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed ml-4">
                            {useCase.challenge}
                          </p>
                        </div>

                        {/* Solution */}
                        <div data-usecase-content>
                          <div className="flex items-center gap-2 mb-2">
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: useCase.color }}
                            />
                            <h4
                              className="text-xs font-bold uppercase tracking-widest"
                              style={{ color: useCase.color }}
                            >
                              Solution
                            </h4>
                          </div>
                          <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed ml-4">
                            {useCase.solution}
                          </p>
                        </div>

                        {/* Result */}
                        <div data-usecase-content>
                          <div className="flex items-center gap-2 mb-2">
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: useCase.color }}
                            />
                            <h4
                              className="text-xs font-bold uppercase tracking-widest"
                              style={{ color: useCase.color }}
                            >
                              Result
                            </h4>
                          </div>
                          <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed ml-4">
                            {useCase.result}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 lg:mt-32 text-center">
          <p
            className="text-[var(--color-text-secondary)] mb-8 text-lg"
            data-usecase-content
          >
            Ready to transform your ideas into reality?
          </p>
          <a
            href="#contact"
            className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-[var(--color-accent)] text-white font-bold transition-all duration-300 hover:scale-105 active:scale-95 group overflow-hidden relative shadow-lg hover:shadow-xl"
          >
            <span className="relative z-10 flex items-center">
              Start Your Journey
              <svg
                className="ml-3 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 10l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
              }}
            />
          </a>
        </div>
      </div>

      {/* CSS keyframes for animations */}
      <style jsx>{`
        @keyframes shimmer-right {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes shimmer-left {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }

        [data-timeline-accent] {
          transform-style: preserve-3d;
        }
      `}</style>
    </section>
  );
}
