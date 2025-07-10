import { TextEffect } from "@/components/motion-primitives/text-effect";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Construction,
  ConstructionIcon,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
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
        {/* <AppFooter /> */}
      </main>
    </>
  );
}

const AppComponent = () => {
  return (
    <div className="relative space-y-3 rounded-[1rem] bg-white/5 p-4">
      <div className="flex items-center gap-1.5 text-sky-400">
        <svg
          className="size-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M4 4v16h16V4H4Zm2 2h12v12H6V6Zm2 2v2h8V8H8Zm0 4v2h5v-2H8Z"
          />
        </svg>
        <div className="text-sm font-medium">Product Updates</div>
      </div>
      <div className="space-y-3">
        <div className="text-foreground border-b border-white/10 pb-3 text-sm font-medium">
          Your team has published more changelog updates this year than last
          year.
        </div>
        <div className="space-y-3">
          <div className="space-y-1">
            <div className="space-x-1">
              <span className="text-foreground align-baseline text-xl font-medium">
                36
              </span>
              <span className="text-muted-foreground text-xs">
                Updates/month
              </span>
            </div>
            <div className="flex h-5 items-center rounded bg-gradient-to-l from-sky-400 to-blue-600 px-2 text-xs text-white">
              2025
            </div>
          </div>
          <div className="space-y-1">
            <div className="space-x-1">
              <span className="text-foreground align-baseline text-xl font-medium">
                18
              </span>
              <span className="text-muted-foreground text-xs">
                Updates/month
              </span>
            </div>
            <div className="text-foreground bg-muted flex h-5 w-2/3 items-center rounded px-2 text-xs dark:bg-white/20">
              2024
            </div>
          </div>
        </div>

        {/* Reactions Section */}
        <div className="border-t border-white/10 pt-3 space-y-2">
          <div className="text-sm font-medium text-foreground">
            Users reacted <span className="font-semibold text-white">213</span>{" "}
            times to your changelogs this month
          </div>
          <div className="flex gap-2 flex-wrap text-sm">
            <span className="bg-white/10 text-white px-3 py-1 rounded-full flex items-center gap-1">
              🚀 <span className="font-medium">98</span>
            </span>
            <span className="bg-white/10 text-white px-3 py-1 rounded-full flex items-center gap-1">
              ❤️ <span className="font-medium">67</span>
            </span>
            <span className="bg-white/10 text-white px-3 py-1 rounded-full flex items-center gap-1">
              🔥 <span className="font-medium">34</span>
            </span>
            <span className="bg-white/10 text-white px-3 py-1 rounded-full flex items-center gap-1">
              🙌 <span className="font-medium">14</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
