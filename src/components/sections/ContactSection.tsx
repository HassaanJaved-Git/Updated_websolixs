"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { SiteContent } from "@/types";

gsap.registerPlugin(ScrollTrigger);

interface ContactProps {
  contact: SiteContent["contact"];
}

export default function ContactSection({ contact }: ContactProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [form, setForm] = useState({ name: "", email: "", project: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.fromTo(
      "[data-contact-col]",
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          once: true,
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    // Simulate send
    await new Promise((r) => setTimeout(r, 1500));
    setStatus("sent");
  };

  const inputClass =
    "w-full px-4 py-3.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] text-sm placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)] transition-colors duration-200";

  return (
    <section
      ref={sectionRef}
      id="contact"
      aria-labelledby="contact-heading"
      className="section-padding relative overflow-hidden"
    >
      {/* Accent glow */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-64 rounded-full opacity-10"
        style={{
          background: "radial-gradient(ellipse, var(--color-accent) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      <div className="container-wide relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left info */}
          <div data-contact-col>
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-[var(--color-accent)] mb-4">
              Contact
            </span>
            <h2
              id="contact-heading"
              className="text-[clamp(2.5rem,5vw,4rem)] font-black leading-tight tracking-tight text-[var(--color-text-primary)] mb-6 whitespace-pre-line"
            >
              {contact.heading}
            </h2>
            <p className="text-[var(--color-text-secondary)] text-lg mb-10">
              {contact.subheading}
            </p>

            {/* Contact details */}
            <address className="not-italic flex flex-col gap-5 mb-10">
              <a
                href={`mailto:${contact.info.email}`}
                className="group flex items-center gap-4 text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors duration-200"
              >
                <span className="w-10 h-10 flex items-center justify-center rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-accent)] shrink-0">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="1" y="3" width="14" height="10" rx="2" /><path d="M1 5l7 4.5L15 5" />
                  </svg>
                </span>
                {contact.info.email}
              </a>
              <a
                href={`tel:${contact.info.phone.replace(/\s/g, "")}`}
                className="group flex items-center gap-4 text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors duration-200"
              >
                <span className="w-10 h-10 flex items-center justify-center rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-accent)] shrink-0">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M1.5 2.5A1.5 1.5 0 0 1 3 1h1.5a1.5 1.5 0 0 1 1.5 1.5v1a1.5 1.5 0 0 1-.44 1.06L4.5 5.12A11 11 0 0 0 9.88 10.5l.56-1.06A1.5 1.5 0 0 1 11.5 9h1A1.5 1.5 0 0 1 14 10.5v1.5A1.5 1.5 0 0 1 12.5 13.5C6.15 13.5 1.5 8.85 1.5 2.5z" />
                  </svg>
                </span>
                {contact.info.phone}
              </a>
              <div className="flex items-center gap-4 text-[var(--color-text-secondary)]">
                <span className="w-10 h-10 flex items-center justify-center rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-accent)] shrink-0">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M8 1a5 5 0 1 0 0 7 5 5 0 0 0 0-7zM8 9s-5 3-5 5h10c0-2-5-5-5-5z" />
                  </svg>
                </span>
                {contact.info.address}
              </div>
            </address>

            {/* Socials */}
            <div className="flex items-center gap-3">
              {contact.info.socials.map((s) => (
                <a
                  key={s.platform}
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] hover:border-[var(--color-accent)]/40 transition-all duration-200"
                >
                  <span className="text-xs font-bold">{s.platform.slice(0, 2)}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Right form */}
          <div data-contact-col>
            {status === "sent" ? (
              <div className="p-10 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-accent)]/30 flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 rounded-full bg-[var(--color-accent-dim)] flex items-center justify-center">
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M4 14l7 7L24 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-black text-[var(--color-text-primary)]">Message Sent!</h3>
                <p className="text-[var(--color-text-secondary)]">We'll get back to you within 24 hours.</p>
                <button
                  onClick={() => setStatus("idle")}
                  className="px-6 py-3 rounded-full border border-[var(--color-border)] text-sm font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                >
                  Send another
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="p-8 md:p-10 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] flex flex-col gap-5"
                aria-label="Contact form"
                noValidate
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="contact-name" className="block text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-2">
                      Name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="John Smith"
                      className={inputClass}
                      autoComplete="name"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="block text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-2">
                      Email
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="john@company.com"
                      className={inputClass}
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-project" className="block text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-2">
                    Project Type
                  </label>
                  <select
                    id="contact-project"
                    value={form.project}
                    onChange={(e) => setForm({ ...form, project: e.target.value })}
                    className={inputClass}
                  >
                    <option value="">Select a service...</option>
                    <option>Web Development</option>
                    <option>Mobile App</option>
                    <option>UI/UX Design</option>
                    <option>Cloud & DevOps</option>
                    <option>AI Integration</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-2">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us about your project..."
                    className={`${inputClass} resize-none`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="group flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-[var(--color-accent)] text-[var(--color-bg)] font-bold text-sm transition-all duration-300 hover:shadow-[0_0_40px_rgba(200,255,0,0.25)] disabled:opacity-60 disabled:cursor-not-allowed"
                  aria-live="polite"
                >
                  {status === "sending" ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                        <path d="M4 12a8 8 0 0 1 8-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="opacity-75" />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
