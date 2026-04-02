import type { SiteContent } from "@/types";
import enContent from "@/data/content.en.json";

export function getContent(locale = "en"): SiteContent {
  // Future: load by locale from content.{locale}.json
  if (locale === "en") return enContent as SiteContent;
  return enContent as SiteContent;
}
