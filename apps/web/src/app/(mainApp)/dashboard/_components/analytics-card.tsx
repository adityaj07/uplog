import NeumorphWrapper from "@/components/neumorph-wrapper";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import clsx from "clsx";
import { LineChart } from "lucide-react";
import { type FC } from "react";

interface AnalyticsCardProps {
  analyticsLogs: {
    totalChangelogs: number;
    publicViews: number;
    publishedThisMonth: number;
    scheduled: number;
    reactions?: {
      thumbsUp: number;
      heart: number;
      fire: number;
    } | null;
  };
}

const AnalyticsCard: FC<AnalyticsCardProps> = ({ analyticsLogs }) => {
  const totalReactions =
    (analyticsLogs.reactions?.thumbsUp || 0) +
    (analyticsLogs.reactions?.heart || 0) +
    (analyticsLogs.reactions?.fire || 0);

  const reactionItems = [
    {
      emoji: "👍",
      count: analyticsLogs.reactions?.thumbsUp || 0,
      label: "Thumbs Up",
    },
    {
      emoji: "❤️",
      count: analyticsLogs.reactions?.heart || 0,
      label: "Hearts",
    },
    {
      emoji: "🔥",
      count: analyticsLogs.reactions?.fire || 0,
      label: "Fire",
    },
  ];

  return (
    <div className="sticky top-4">
      <Card className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Analytics Overview</h3>
          <LineChart className="w-5 h-5 text-muted-foreground" />
        </div>

        {/* Key Stats */}
        <div className="grid gap-3">
          <div className="flex justify-between">
            <p className="text-xs text-muted-foreground">Total Changelogs</p>
            <p className="font-semibold">{analyticsLogs.totalChangelogs}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-xs text-muted-foreground">Public Views (30d)</p>
            <p className="font-semibold">{analyticsLogs.publicViews}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-xs text-muted-foreground">
              Published This Month
            </p>
            <p className="font-semibold">{analyticsLogs.publishedThisMonth}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-xs text-muted-foreground">Scheduled</p>
            <p className="font-semibold">{analyticsLogs.scheduled}</p>
          </div>
        </div>

        <Separator />

        {/* Reaction Panel */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">
            Changelog Reactions
          </h4>

          {totalReactions === 0 ? (
            <div className="text-sm text-muted-foreground text-center py-4">
              No reactions yet. Make your changelogs more engaging ✨
            </div>
          ) : (
            <TooltipProvider>
              <NeumorphWrapper className="flex flex-row justify-around items-center rounded-md after:rounded-lg mx-auto max-w-sm relative h-full bg-[#ff622e] [box-shadow:0_0_10px_-1px_#00000050] border border-[#d94e1f]  overflow-hidden after:absolute after:inset-0 after:pointer-events-none after:content-['']  after:border-t-[3px] after:border-r-[3px] after:border-t-[#ff8757] after:border-r-[#c9441a] after:hover:border-t-[#ff9d76] after:hover:border-r-transparent after:hover:[box-shadow:inset_0_4px_12px_#00000060] transition-all duration-200 p-2 mt-4">
                {reactionItems.map((reaction, idx) => (
                  <Tooltip key={idx}>
                    <TooltipTrigger asChild>
                      <div
                        className={clsx(
                          "flex flex-col items-center justify-center gap-0.5 px-3 py-1 rounded-md hover:bg-white/10 transition duration-150 cursor-default"
                        )}
                      >
                        <div className="text-xl">{reaction.emoji}</div>
                        <span className="text-xs font-medium">
                          {reaction.count}
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-xs">
                      {reaction.label}
                    </TooltipContent>
                  </Tooltip>
                ))}
              </NeumorphWrapper>
            </TooltipProvider>
          )}
        </div>

        {/* CTA */}
        <Button variant="outline" className="w-full text-sm">
          View detailed analytics
        </Button>
      </Card>
    </div>
  );
};

export default AnalyticsCard;
