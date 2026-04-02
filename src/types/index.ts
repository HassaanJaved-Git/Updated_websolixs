// ============================================
// CONTENT TYPES
// ============================================

export interface SeoMeta {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  canonical?: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface HeroContent {
  badge: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
  ctaPrimary: { label: string; href: string };
  ctaSecondary: { label: string; href: string };
  stats: { value: string; label: string }[];
}

export interface ServiceCard {
  id: string;
  icon: string;
  title: string;
  description: string;
  tags: string[];
}

export interface ProjectCard {
  id: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  image: string;
  color: string;
  href: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  quote: string;
  rating: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  socials: { platform: string; href: string }[];
}

export interface Stat {
  value: string;
  suffix: string;
  label: string;
  description: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  address: string;
  socials: { platform: string; href: string; label: string }[];
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterColumn {
  heading: string;
  links: FooterLink[];
}

export interface SiteContent {
  seo: SeoMeta;
  nav: { logo: string; tagline: string; items: NavItem[]; cta: string };
  hero: HeroContent;
  services: { heading: string; subheading: string; items: ServiceCard[] };
  projects: { heading: string; subheading: string; items: ProjectCard[] };
  stats: { heading: string; items: Stat[] };
  about: { heading: string; subheading: string; body: string; image: string; highlights: string[] };
  testimonials: { heading: string; subheading: string; items: Testimonial[] };
  contact: { heading: string; subheading: string; info: ContactInfo };
  footer: { columns: FooterColumn[]; legal: string; builtWith: string };
}
