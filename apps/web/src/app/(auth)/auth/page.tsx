// app/(auth)/auth/page.tsx
"use client";

import { Button } from "@/components/ui/button";

import { Icons } from "@/components/icons";
import NeumorphWrapper from "@/components/neumorph-wrapper";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();

  const handleLogin = () => {
    // Trigger Google Sign-in logic
    router.push("/dashboard");
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 overflow-hidden">
      {/* 🌟 Large Cloud Blob Background */}
      {/* <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.img
          src="/decor.webp"
          alt="Background Decor"
          className="w-[900px] h-[700px] object-cover pointer-events-none"
          style={{
            clipPath: "ellipse(65% 50% at 50% 50%)",
            filter:
              "blur(2px) saturate(2.2) contrast(1.3) brightness(1.15) hue-rotate(-8deg)",
            mixBlendMode: "screen",
            opacity: 0.7,
          }}
          initial={{ rotate: -3, scale: 0.95 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </motion.div> */}

      {/* 🌫️ Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/70 to-background/90 pointer-events-none z-[1]" />

      {/* 📶 Noise overlay */}
      <div className="absolute inset-0 z-[2] pointer-events-none mix-blend-overlay opacity-[0.08] bg-[url('/noise.svg')]" />

      {/* 🧱 Elevated Card */}
      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
      >
        <div className="space-y-8 p-10 rounded-2xl border border-border/50 bg-card/95 backdrop-blur-sm shadow-2xl">
          <div className="text-center space-y-3">
            <motion.h1
              className="text-4xl font-bold tracking-tight text-primary"
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              Sign in to uplog
            </motion.h1>
            <motion.p
              className="text-base text-muted-foreground/80"
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              Your changelog, unified and beautiful.
            </motion.p>
          </div>

          <motion.div
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <NeumorphWrapper className="rounded-md after:rounded-lg">
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-3 h-12 text-base font-medium border-border/70 hover:bg-accent transition-all duration-200 cursor-pointer "
                onClick={handleLogin}
              >
                <Icons.googleIcon className="h-5 w-5" />
                Continue with Google
              </Button>
            </NeumorphWrapper>
          </motion.div>

          <motion.p
            className="text-center text-sm text-muted-foreground/70 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            By signing in, you agree to our{" "}
            <a
              href="/terms"
              className="underline underline-offset-2 hover:text-foreground transition-colors"
            >
              Terms
            </a>{" "}
            and{" "}
            <a
              href="/privacy"
              className="underline underline-offset-2 hover:text-foreground transition-colors"
            >
              Privacy Policy
            </a>
            .
          </motion.p>
          <motion.a
            className="flex justify-center items-center text-center text-sm text-muted-foreground/50 leading-relaxed mt-2 mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            href="/"
          >
            <span className="flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer">
              <span className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-1">
                <ArrowLeft className="mr-2 h-4" />
              </span>
              Back
            </span>
          </motion.a>
        </div>
      </motion.div>
    </div>
  );
}
