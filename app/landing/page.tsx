"use client";

import Hero from "@/components/landing/Hero";
import CapabilityBanner from "@/components/landing/CapabilityBanner";
import ProblemSolution from "@/components/landing/ProblemSolution";
import HowItWorks from "@/components/landing/HowItWorks";
import ModeCards from "@/components/landing/ModeCards";
import UseCases from "@/components/landing/UseCases";
import SamplePreview from "@/components/landing/SamplePreview";
import FAQ from "@/components/landing/FAQ";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <main>
        <Hero />
        <CapabilityBanner />
        <ProblemSolution />
        <HowItWorks />
        <ModeCards />
        <UseCases />
        <SamplePreview />
        <FAQ />
        <FinalCTA />
        <Footer />
      </main>
    </div>
  );
}
