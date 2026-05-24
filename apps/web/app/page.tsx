import {
  HeroSection,
  SocialProofSection,
  ProductShowcaseSection,
  FeaturesSection,
  TemplatesShowcase,
  AnalyticsShowcase,
  HowItWorksSection,
  WhyMiraiFormsSection,
  PricingSection,
  FaqSection,
  FinalCtaSection,
  Footer,
} from "~/components/landing";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      <SocialProofSection />
      <ProductShowcaseSection />
      <FeaturesSection />
      <TemplatesShowcase />
      <AnalyticsShowcase />
      <HowItWorksSection />
      <WhyMiraiFormsSection />
      <PricingSection />
      <FaqSection />
      <FinalCtaSection />
      <Footer />
    </main>
  );
}
