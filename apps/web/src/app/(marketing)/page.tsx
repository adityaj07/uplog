"use client";

import { GradientBars } from "@/components/gradient-bars";
import HeroSection from "@/components/hero-section";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Home() {
  const isMobile = useIsMobile();
  return (
    <div>
      <GradientBars bars={isMobile ? 10 : 20} />
      <HeroSection />
    </div>
  );
}
