"use client";

import { GradientBars } from "@/components/gradient-bars";
import HeroSection from "@/components/hero-section";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Home() {
  const isMobile = useIsMobile();
  return (
    <div>
      <GradientBars
        bars={isMobile ? 20 : 15}
        // sideWidthPercent={isMobile ? 35 : 30}
      />
      <HeroSection />
    </div>
  );
}
