"use client";

import HeroSection from "@/components/hero-section";
import { SideWaveBars } from "@/components/sidebar-waves";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Home() {
  const isMobile = useIsMobile();
  return (
    <div>
      <SideWaveBars bars={isMobile ? 10 : 15} />
      <HeroSection />
    </div>
  );
}
