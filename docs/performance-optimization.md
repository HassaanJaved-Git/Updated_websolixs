# Performance Optimization Guide

## Current Optimizations

| Area              | Implementation                                          |
|-------------------|--------------------------------------------------------|
| Fonts             | `next/font/google` with `display: swap`               |
| Images            | `next/image` with AVIF/WebP formats                   |
| CSS               | `optimizeCss: true` in next.config.ts                 |
| JS                | Dynamic imports, tree-shaking via Turbopack            |
| Scroll            | Lenis smooth scroll + GSAP `gsap.ticker` integration  |
| Animations        | `will-change` only on animating elements               |
| Server rendering  | All sections are SSR; only `"use client"` for animations |

## Lighthouse Checklist

### LCP (Largest Contentful Paint)
- Hero heading uses `text-[clamp(...)]` — no layout shift
- No images above the fold (SVG + CSS only)
- Fonts preloaded via `next/font`

### CLS (Cumulative Layout Shift)
- All section heights defined via `section-padding` CSS var
- No images without explicit width/height

### INP (Interaction to Next Paint)
- GSAP animations use `will-change: transform`
- Lenis scroll uses `gsap.ticker` (avoids double RAF)
- Event listeners are passive where possible

## Adding Images

Always use `next/image`:

```tsx
import Image from "next/image";

<Image
  src="/images/my-image.webp"
  alt="Descriptive alt text"  // Required
  width={800}
  height={600}
  loading="lazy"              // or "eager" for above-fold
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

## Bundle Size

Run `ANALYZE=true npm run build` (after installing `@next/bundle-analyzer`) to inspect bundle.

Heavy libraries:
- `gsap` — ~80KB (loaded client-side only via `"use client"`)
- `framer-motion` — ~60KB (use `LazyMotion` + `domAnimation` subset if needed)
- `lenis` — ~15KB

## Caching

Add cache headers in `next.config.ts` for static assets:

```ts
headers: async () => [{
  source: "/images/(.*)",
  headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }]
}]
```
