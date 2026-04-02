# Adding a New Language

## Steps

1. **Create the content file**

   Duplicate `src/data/content.en.json` and rename it `content.ur.json` (or whatever locale code).
   Translate every string value — do not change the JSON keys.

2. **Update the content loader**

   In `src/lib/content.ts`, add an import and condition:

   ```ts
   import urContent from "@/data/content.ur.json";

   export function getContent(locale = "en"): SiteContent {
     if (locale === "ur") return urContent as SiteContent;
     return enContent as SiteContent;
   }
   ```

3. **Add a locale route (optional)**

   Create `src/app/[locale]/page.tsx`:

   ```tsx
   import { getContent } from "@/lib/content";
   // ...same as page.tsx but pass locale param to getContent
   ```

4. **Add hreflang in layout.tsx**

   ```tsx
   <link rel="alternate" hrefLang="ur" href="https://websolixs.com/ur" />
   ```

5. **Update sitemap.ts** to include the new locale URL.

---

## RTL Support (for Urdu/Arabic)

Add `dir="rtl"` to the `<html>` tag when the locale is RTL:

```tsx
<html lang={locale} dir={locale === "ur" ? "rtl" : "ltr"}>
```

Then add `[dir="rtl"]` CSS overrides in `globals.css` as needed.
