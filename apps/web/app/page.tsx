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

export const metadata = {
  title: "MiraiForms | The Modern Form Builder",
  description: "Build, share, and analyze beautiful forms in minutes with MiraiForms.",
};

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
