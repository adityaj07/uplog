"use client";

import HeroSection from "@/components/hero-section";
import { SideWaveBars } from "@/components/sidebar-waves";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Home() {
  const isMobile = useIsMobile();
  return (
    <div>
      <SideWaveBars
        bars={isMobile ? 20 : 15}
        sideWidthPercent={isMobile ? 35 : 30}
      />
      <HeroSection />
    </div>
  );
}
