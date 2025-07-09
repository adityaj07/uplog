"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getGreeting } from "@/utils/getGreeting";
import { motion } from "framer-motion";
import { Crown, Globe, Plus, Sparkles } from "lucide-react";
import { type FC } from "react";

// Mocked props/data — replace with actual dynamic data
const user = {
  firstName: "Aditya",
  role: "OWNER",
};

const workspace = {
  name: "Uplog HQ",
  subdomain: "uplog",
};

interface GreetingCardProps {
  className?: React.ComponentProps<"div">["className"];
}

const GreetingCard: FC<GreetingCardProps> = ({ className }) => {
  const getRoleIcon = (role: string) => {
    switch (role) {
      case "OWNER":
        return <Crown className="w-4 h-4 text-yellow-500" />;
      case "ADMIN":
        return <Sparkles className="w-4 h-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "OWNER":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "ADMIN":
        return "text-blue-600 bg-blue-50 border-blue-200";
      default:
        return "text-primary bg-primary/10 border-primary/20";
    }
  };

  return (
    <div className={cn("relative", className)}>
      <motion.div
        className="absolute top-4 right-4 w-12 h-12 bg-primary/10 rounded-full blur-xl will-change-transform"
        animate={{
          transform: ["scale(1)", "scale(1.1)", "scale(1)"],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          repeatType: "reverse",
        }}
      />
      <motion.div
        className="absolute bottom-4 left-4 w-8 h-8 bg-primary/5 rounded-full blur-lg will-change-transform"
        animate={{
          transform: ["scale(1)", "scale(1.1)", "scale(1)"],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          repeatType: "reverse",
        }}
      />

      {/* Main Card */}
      <div className="relative bg-white dark:bg-muted/80 backdrop-blur-md border border-border rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Left Section */}
          <div className="space-y-3 flex-1">
            <div className="space-y-1">
              <h1 className="text-3xl md:text-4xl font-bold leading-tight text-gray-900 dark:text-gray-100">
                <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                  {getGreeting()}
                </span>
                <span className="text-gray-700 dark:text-gray-300">, </span>
                <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  {user.firstName}
                </span>

                <span
                  className="inline-block ml-2"
                  style={{
                    animation: "wave 2s ease-in-out infinite",
                    transformOrigin: "70% 70%",
                  }}
                >
                  👋
                </span>
              </h1>

              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                <span>Working in</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">
                  {workspace.name}
                </span>
                <span className="text-gray-300 dark:text-gray-600">·</span>
                <div
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${getRoleColor(
                    user.role
                  )}`}
                >
                  {getRoleIcon(user.role)}
                  {user.role}
                </div>
              </div>
            </div>

            {/* Optimized Status */}
            <div className="hidden md:flex items-center gap-4 text-xs text-muted-foreground pt-2">
              <div className="flex items-center gap-1">
                {/* Replace animate-pulse with CSS animation */}
                <div
                  className="w-2 h-2 bg-green-500 rounded-full"
                  style={{
                    animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                  }}
                />
                <span>All systems operational</span>
              </div>
              <div className="flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>5 new updates today</span>
              </div>
            </div>
          </div>

          {/* Right: Action Buttons - reduce animation intensity */}
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.1 }}
            >
              <Button
                size="sm"
                variant="outline"
                className="flex-1 lg:flex-none h-10 px-4 cursor-pointer"
              >
                <Globe className="w-4 h-4 mr-2" />
                Preview Public Page
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.1 }}
            >
              <Button
                size="sm"
                className="flex-1 lg:flex-none h-10 px-4 bg-gradient-to-r from-primary to-primary/90 text-white shadow-md hover:shadow-lg cursor-pointer"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Changelog
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Add custom CSS for optimized animations */}
      <style jsx>{`
        @keyframes wave {
          0%,
          100% {
            transform: rotate(0deg);
          }
          10%,
          30% {
            transform: rotate(14deg);
          }
          20% {
            transform: rotate(-8deg);
          }
          40% {
            transform: rotate(14deg);
          }
          50% {
            transform: rotate(-4deg);
          }
          60% {
            transform: rotate(10deg);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
};

export default GreetingCard;
