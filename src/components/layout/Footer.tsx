import type { SiteContent } from "@/types";

interface FooterProps {
  footer: SiteContent["footer"];
  nav: SiteContent["nav"];
}

export default function Footer({ footer, nav }: FooterProps) {
  return (
    <footer
      role="contentinfo"
      className="relative border-t border-[var(--color-border)] bg-[var(--color-bg-secondary)]"
    >
      {/* Top glow */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent opacity-60"
      />

      <div className="container-wide py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <a href="#" aria-label={nav.logo} className="inline-block mb-4">
              <span className="text-2xl font-black tracking-[-0.04em] uppercase">
                {nav.logo.slice(0, 3)}
                <span className="text-[var(--color-accent)]">{nav.logo.slice(3)}</span>
              </span>
            </a>
            <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed max-w-xs mb-6">
              {nav.tagline}
              <br />
              Next-generation software engineering, built for scale.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-accent)] hover:gap-3 transition-all duration-300"
            >
              Start a project
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>

          {/* Link columns */}
          {footer.columns.map((col) => (
            <div key={col.heading}>
              <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-4">
                {col.heading}
              </h3>
              <ul className="flex flex-col gap-3" role="list">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-[var(--color-border)]">
          <p className="text-xs text-[var(--color-text-muted)]">{footer.legal}</p>
          <p className="text-xs text-[var(--color-text-muted)]">{footer.builtWith}</p>
        </div>
      </div>
    </footer>
  );
}
