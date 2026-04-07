import { getContent } from "@/lib/content";
import ProgressBar from "@/components/ui/ProgressBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import TechMarquee from "@/components/sections/TechMarquee";
import ServicesSection from "@/components/sections/ServicesSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import StatsSection from "@/components/sections/StatsSection";
import AboutSection from "@/components/sections/AboutSection";
import UseCasesSection from "@/components/sections/UseCasesSection";
import ContactSection from "@/components/sections/ContactSection";

export default function HomePage() {
  const content = getContent();

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-[var(--color-accent)] focus:text-[var(--color-bg)] focus:font-bold"
      >
        Skip to main content
      </a>

      <ProgressBar />
      <Navbar nav={content.nav} />

      <main id="main-content">
        <HeroSection hero={content.hero} />
        <TechMarquee />
        <ServicesSection services={content.services} />
        <ProjectsSection projects={content.projects} />
        <StatsSection stats={content.stats} />
        <AboutSection about={content.about} />
        <UseCasesSection useCases={content.useCases} />
        <ContactSection contact={content.contact} />
      </main>

      <Footer footer={content.footer} nav={content.nav} />
    </>
  );
}
