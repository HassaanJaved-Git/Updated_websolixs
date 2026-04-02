"use client";

import { useRef, useCallback } from "react";
import { gsap } from "gsap";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  as?: "button" | "a";
  href?: string;
  onClick?: () => void;
  "aria-label"?: string;
}

export default function MagneticButton({
  children,
  className = "",
  strength = 0.4,
  as: Tag = "button",
  href,
  onClick,
  "aria-label": ariaLabel,
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement & HTMLAnchorElement>(null);

  const onMove = useCallback(
    (e: React.MouseEvent<HTMLButtonElement & HTMLAnchorElement>) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * strength;
      const dy = (e.clientY - cy) * strength;
      gsap.to(el, { x: dx, y: dy, duration: 0.3, ease: "power2.out" });
    },
    [strength]
  );

  const onLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
  }, []);

  // Only enable on non-touch devices
  const handlers =
    typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches
      ? { onMouseMove: onMove, onMouseLeave: onLeave }
      : {};

  return (
    <Tag
      ref={ref}
      className={className}
      href={href as string}
      onClick={onClick}
      aria-label={ariaLabel}
      data-cursor-hover
      {...handlers}
    >
      {children}
    </Tag>
  );
}
