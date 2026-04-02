# Updating SEO Content

All SEO content lives in `src/data/content.en.json` under the `"seo"` key.

## Available Fields

```json
{
  "seo": {
    "title": "Page title shown in browser tabs and Google results",
    "description": "160-char meta description shown in Google snippets",
    "keywords": ["keyword1", "keyword2"],
    "ogImage": "/og-image.jpg",
    "canonical": "https://websolixs.com"
  }
}
```

## Where These Are Used

| Field         | Used in                                      |
|---------------|----------------------------------------------|
| `title`       | `<title>`, OG title, Twitter title          |
| `description` | `<meta description>`, OG/Twitter description|
| `keywords`    | `<meta keywords>`                            |
| `ogImage`     | OG image, Twitter card image                 |
| `canonical`   | Canonical URL, JSON-LD schema URLs           |

## JSON-LD Structured Data

JSON-LD schemas are auto-generated in `src/components/ui/JsonLd.tsx`:
- `Organization` — company info
- `WebSite` — site-wide schema
- `Service` — one schema per service card (from `services.items`)

To add more schemas, extend `JsonLd.tsx`.

## OG Image

Replace `/public/og-image.jpg` with a 1200×630px image.
Use a tool like Figma or `@vercel/og` for dynamic OG images.
