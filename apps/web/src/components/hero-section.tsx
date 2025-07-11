import { TextEffect } from "@/components/motion-primitives/text-effect";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Construction,
  ConstructionIcon,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import AppComponent from "./app-preview-component";
import { AnimatedGroup } from "./motion-primitives/animated-group";

const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      filter: "blur(12px)",
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        type: "spring" as const,
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
};

export default function HeroSection() {
  return (
    <>
      <main className="overflow-hidden [--color-primary-foreground:var(--color-white)] [--color-primary:var(--color-green-600)]">
        <section className="relative">
          {/* Background Image */}
          {/* <div
            className="absolute inset-5 md:inset-12 mt-12 bg-cover bg-center bg-no-repeat rounded-4xl filter blur-sm"
            style={{
              backgroundImage: "url('/bg.jpeg')",
            }}
          /> */}
          {/* Overlay */}
          {/* <div className="absolute inset-0 bg-black/60" /> */}
          <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-32 lg:pt-36">
            <AnimatedGroup variants={transitionVariants} className="mb-10">
              <Link
                href="#link"
                className="hover:bg-background dark:hover:border-t-border bg-muted group mx-auto flex w-fit items-center gap-4 rounded-full border p-1 pl-4 shadow-md shadow-zinc-950/5 transition-colors duration-300 dark:border-t-white/5 dark:shadow-zinc-950"
              >
                <span className="text-foreground text-sm">
                  This site is a work in progress.
                </span>
                <span className="dark:border-background block h-4 w-0.5 border-l bg-white dark:bg-zinc-700"></span>

                <div className="bg-background group-hover:bg-muted size-6 overflow-hidden rounded-full duration-500">
                  <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                    <span className="flex size-6">
                      <ConstructionIcon className="m-auto size-3" />
                    </span>
                    <span className="flex size-6">
                      <Construction className="m-auto size-3" />
                    </span>
                  </div>
                </div>
              </Link>
            </AnimatedGroup>
            <div className="relative z-10 mx-auto max-w-4xl text-center">
              <TextEffect
                preset="fade-in-blur"
                speedSegment={0.3}
                as="h1"
                className="text-balance text-5xl font-medium md:text-6xl"
              >
                Changelogs done right.
              </TextEffect>
              <TextEffect
                per="line"
                preset="fade-in-blur"
                speedSegment={0.3}
                delay={0.5}
                as="p"
                className="mx-auto mt-6 max-w-2xl text-pretty text-lg"
              >
                From launch day to feature drops, Uplog helps you communicate
                what's new—beautifully.
              </TextEffect>

              <AnimatedGroup
                variants={{
                  container: {
                    visible: {
                      transition: {
                        staggerChildren: 0.05,
                        delayChildren: 0.75,
                      },
                    },
                  },
                  item: transitionVariants.item,
                }}
                className="mt-10 space-y-4"
              >
                {/* CTA button */}
                <div className="mx-auto max-w-sm relative h-full bg-[#ff622e] [box-shadow:0_0_10px_-1px_#00000050] border border-[#d94e1f] rounded-2xl overflow-hidden after:absolute after:inset-0 after:pointer-events-none after:content-[''] after:rounded-2xl after:border-t-[3px] after:border-r-[3px] after:border-t-[#ff8757] after:border-r-[#c9441a] after:hover:border-t-[#ff9d76] after:hover:border-r-transparent after:hover:[box-shadow:inset_0_4px_12px_#00000060] transition-all duration-200">
                  <Button
                    size="lg"
                    className="w-full h-12 justify-center text-base font-semibold group cursor-pointer"
                    onClick={() => {
                      window.location.href = "/auth";
                    }}
                  >
                    <span className="flex items-center gap-1">
                      Publish your changelogs for free
                      <span className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-1">
                        <ArrowRight className="ml-2" />
                      </span>
                    </span>
                  </Button>
                </div>

                {/* Small Text */}
                <p className="text-sm text-muted-foreground mt-1 flex items-center justify-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-yellow-400" /> No credit
                  card required
                </p>

                {/* App Preview */}
                <div
                  aria-hidden
                  className="bg-radial from-primary/50 dark:from-primary/25 relative mx-auto mt-32 max-w-2xl to-transparent to-55% text-left"
                >
                  <div className="bg-background border-border/50 absolute inset-0 mx-auto w-80 -translate-x-3 -translate-y-12 rounded-[2rem] border p-2 [mask-image:linear-gradient(to_bottom,#000_50%,transparent_90%)] sm:-translate-x-6">
                    <div className="relative h-96 overflow-hidden rounded-[1.5rem] border p-2 pb-12 before:absolute before:inset-0 before:bg-[repeating-linear-gradient(-45deg,var(--color-border),var(--color-border)_1px,transparent_1px,transparent_6px)] before:opacity-50"></div>
                  </div>
                  <div className="bg-muted dark:bg-background/50 border-border/50 mx-auto w-80 translate-x-4 rounded-[2rem] border p-2 backdrop-blur-3xl [mask-image:linear-gradient(to_bottom,#000_50%,transparent_90%)] sm:translate-x-8">
                    <div className="bg-background space-y-2 overflow-hidden rounded-[1.5rem] border p-2 shadow-xl dark:bg-white/5 dark:shadow-black dark:backdrop-blur-3xl">
                      <AppComponent />
                      <div className="bg-muted rounded-[1rem] p-4 pb-16 dark:bg-white/5"></div>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] mix-blend-overlay [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] dark:opacity-5"></div>
                </div>
              </AnimatedGroup>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
