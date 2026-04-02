import type { SiteContent } from "@/types";

interface JsonLdProps {
  content: SiteContent;
}

export default function JsonLd({ content }: JsonLdProps) {
  const { seo } = content;

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${seo.canonical}/#organization`,
    name: "Websolixs",
    url: seo.canonical,
    logo: {
      "@type": "ImageObject",
      url: `${seo.canonical}/logo.png`,
    },
    description: seo.description,
    foundingDate: "2021",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Lahore",
      addressCountry: "PK",
    },
    contactPoint: {
      "@type": "ContactPoint",
      email: "info@websolixs.com",
      contactType: "customer service",
    },
    sameAs: [
      "https://linkedin.com/company/websolixs",
      "https://github.com/websolixs",
      "https://twitter.com/websolixs",
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${seo.canonical}/#website`,
    url: seo.canonical,
    name: "Websolixs",
    publisher: { "@id": `${seo.canonical}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: `${seo.canonical}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  const servicesSchema = content.services.items.map((s) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: s.title,
    description: s.description,
    provider: { "@id": `${seo.canonical}/#organization` },
  }));

  const schemas = [organizationSchema, websiteSchema, ...servicesSchema];

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
