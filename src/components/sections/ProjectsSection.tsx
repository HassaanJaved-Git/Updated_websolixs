"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import type { SiteContent } from "@/types";

gsap.registerPlugin(ScrollTrigger);

interface ProjectsProps {
  projects: SiteContent["projects"];
}

export default function ProjectsSection({ projects }: ProjectsProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Heading scroll reveal
  useEffect(() => {
    if (!headingRef.current) return;

    gsap.fromTo(
      headingRef.current,
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 85%",
          once: true,
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // Cards scroll reveal
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const cards = list.querySelectorAll("[data-project-card]");
    gsap.fromTo(
      cards,
      { y: 80, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: list,
          start: "top 80%",
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
      id="projects"
      aria-labelledby="projects-heading"
      className="section-padding relative bg-[var(--color-bg-secondary)]"
    >
      {/* Subtle grid background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(200,255,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(200,255,0,1) 1px, transparent 1px)",
          backgroundSize: "120px 120px",
        }}
      />

      <div className="container-wide relative">
        {/* Heading */}
        <div ref={headingRef} className="mb-16 max-w-2xl">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-[var(--color-accent)] mb-4">
            Work
          </span>
          <h2
            id="projects-heading"
            className="text-[clamp(2.5rem,5vw,4rem)] font-black leading-tight tracking-tight text-[var(--color-text-primary)] mb-4"
          >
            {projects.heading}
          </h2>
          <p className="text-[var(--color-text-secondary)] text-lg leading-relaxed">
            {projects.subheading}
          </p>
        </div>

        {/* Interactive expandable project list */}
        <div
          ref={listRef}
          role="list"
          aria-label="Featured projects"
          className="flex gap-4 w-full"
          style={{ minHeight: 420 }}
        >
          {projects.items.map((project) => {
            const isHovered = hoveredId === project.id;
            const hasHover = hoveredId !== null;

            return (
              <article
                key={project.id}
                data-project-card
                role="listitem"
                onMouseEnter={() => setHoveredId(project.id)}
                onMouseLeave={() => setHoveredId(null)}
                onFocus={() => setHoveredId(project.id)}
                onBlur={() => setHoveredId(null)}
                tabIndex={0}
                aria-label={`${project.title} — ${project.category}`}
                className="relative rounded-2xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)] cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
                style={{
                  flex: isHovered ? "3 1 0%" : hasHover ? "0.6 1 0%" : "1 1 0%",
                  transition: "flex 0.5s cubic-bezier(0.34,1.2,0.64,1)",
                  minWidth: 60,
                }}
              >
                {/* Background image or color fallback */}
                <div 
                  className="absolute inset-0 w-full h-full"
                  style={{
                    backgroundImage: project.id === "proj-5" ? `url(${project.image})` : `linear-gradient(135deg, ${project.color}40 0%, ${project.color}20 50%, ${project.color}30 100%)`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  {/* Dark overlay for text readability */}
                  <div
                    className="absolute inset-0 w-full h-full"
                    style={{
                      background: `linear-gradient(135deg, rgba(13,13,26,0.6) 0%, rgba(13,13,26,0.5) 60%, rgba(13,13,26,0.7) 100%)`,
                    }}
                  />
                  {/* Color accent glow on hover */}
                  <div
                    className="absolute inset-0 w-full h-full transition-opacity duration-500"
                    style={{
                      background: `radial-gradient(ellipse at 30% 40%, ${project.color}20 0%, transparent 60%)`,
                      opacity: isHovered ? 1 : 0.3,
                    }}
                    aria-hidden="true"
                  />
                </div>

                {/* Collapsed label (vertical) */}
                <div
                  className="absolute inset-0 flex items-center justify-center z-10 transition-opacity duration-300"
                  style={{ opacity: isHovered ? 0 : 1 }}
                  aria-hidden={isHovered}
                >
                  <span
                    className="text-sm font-bold text-[var(--color-text-secondary)] uppercase tracking-widest whitespace-nowrap"
                    style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
                  >
                    {project.title}
                  </span>
                </div>

                {/* Expanded content */}
                <div
                  className="absolute inset-0 z-20 p-8 flex flex-col justify-end transition-all duration-500"
                  style={{ opacity: isHovered ? 1 : 0, transform: isHovered ? "translateY(0)" : "translateY(20px)" }}
                  aria-hidden={!isHovered}
                >
                  <span
                    className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4 w-fit"
                    style={{ background: `${project.color}22`, color: project.color }}
                  >
                    {project.category}
                  </span>
                  <h3 className="text-3xl font-black text-[var(--color-text-primary)] mb-3 tracking-tight">
                    {project.title}
                  </h3>
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-5 max-w-sm">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-medium px-3 py-1 rounded-full bg-black/40 border border-white/10 text-[var(--color-text-muted)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <a
                    href={project.href}
                    className="inline-flex items-center gap-2 text-sm font-bold transition-all duration-300 hover:gap-3"
                    style={{ color: project.color }}
                    aria-label={`View ${project.title} project`}
                  >
                    View Project
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
