"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";
import type { SiteContent } from "@/types";

interface NavbarProps {
  nav: SiteContent["nav"];
}

export default function Navbar({ nav }: NavbarProps) {
  const navRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Entrance animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        navRef.current,
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.3 }
      );
    });
    return () => ctx.revert();
  }, []);

  // Scroll shrink
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    if (href.startsWith("#")) {
      const el = document.querySelector(href);
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <header
        ref={navRef}
        role="banner"
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled
            ? "py-3 bg-[var(--color-bg)]/90 backdrop-blur-xl border-b border-[var(--color-border)]"
            : "py-5"
        )}
      >
        <div className="container-wide flex items-center justify-between">
          {/* Logo */}
          <a
            href="#"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="group flex items-center gap-2 focus-visible:outline-none"
            aria-label={`${nav.logo} — go to top`}
          >
            <span className="relative text-xl font-black tracking-[-0.04em] text-[var(--color-text-primary)] uppercase">
              {nav.logo.slice(0, 3)}
              <span className="text-[var(--color-accent)]">{nav.logo.slice(3)}</span>
            </span>
          </a>

          {/* Desktop Nav */}
          <nav
            role="navigation"
            aria-label="Main navigation"
            className="hidden md:flex items-center gap-8"
          >
            {nav.items.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => { e.preventDefault(); handleNavClick(item.href); }}
                className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors duration-200 relative group"
              >
                {item.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[var(--color-accent)] transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* CTA + Burger */}
          <div className="flex items-center gap-4">
            <a
              href="#contact"
              onClick={(e) => { e.preventDefault(); handleNavClick("#contact"); }}
              className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[var(--color-accent)] text-[var(--color-accent)] text-sm font-semibold hover:bg-[var(--color-accent)] hover:text-[var(--color-bg)] transition-all duration-300"
            >
              {nav.cta}
            </a>

            {/* Mobile burger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="md:hidden flex flex-col justify-center items-center gap-1.5 w-10 h-10 relative z-50"
            >
              <span
                className={cn(
                  "block w-6 h-0.5 bg-[var(--color-text-primary)] transition-all duration-300",
                  menuOpen && "rotate-45 translate-y-2"
                )}
              />
              <span
                className={cn(
                  "block w-4 h-0.5 bg-[var(--color-text-primary)] transition-all duration-300",
                  menuOpen && "opacity-0"
                )}
              />
              <span
                className={cn(
                  "block w-6 h-0.5 bg-[var(--color-text-primary)] transition-all duration-300",
                  menuOpen && "-rotate-45 -translate-y-2"
                )}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-[var(--color-bg)] flex flex-col justify-center px-8 md:hidden transition-all duration-500",
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <nav className="flex flex-col gap-6">
          {nav.items.map((item, i) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => { e.preventDefault(); handleNavClick(item.href); }}
              style={{ transitionDelay: menuOpen ? `${i * 60}ms` : "0ms" }}
              className={cn(
                "text-4xl font-black tracking-tight text-[var(--color-text-primary)] hover:text-[var(--color-accent)] transition-all duration-300",
                menuOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              )}
            >
              {item.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={(e) => { e.preventDefault(); handleNavClick("#contact"); }}
            className="mt-4 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--color-accent)] text-[var(--color-bg)] text-base font-bold w-fit"
          >
            {nav.cta}
          </a>
        </nav>
      </div>
    </>
  );
}
