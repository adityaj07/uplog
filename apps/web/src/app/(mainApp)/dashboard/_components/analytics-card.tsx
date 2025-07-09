import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LineChart } from "lucide-react";
import { type FC } from "react";

interface AnalyticsCardProps {
  analyticsLogs: {
    totalChangelogs: number;
    publicViews: number;
    publishedThisMonth: number;
    scheduled: number;
    publishingVelocity: number;
    contributorActivity: number;
  };
}

const AnalyticsCard: FC<AnalyticsCardProps> = ({ analyticsLogs }) => {
  return (
    <div className="sticky top-4">
      <Card className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Analytics Overview</h3>
          <LineChart className="w-5 h-5 text-muted-foreground" />
        </div>

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

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Publishing Velocity</span>
            <span className="text-sm font-bold">
              {analyticsLogs.publishingVelocity}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full"
              style={{ width: `${analyticsLogs.publishingVelocity}%` }}
            />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Contributor Activity</span>
            <span className="text-sm font-bold">
              {analyticsLogs.contributorActivity}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full"
              style={{ width: `${analyticsLogs.contributorActivity}%` }}
            />
          </div>
        </div>

        <Button variant="outline" className="w-full text-sm">
          View detailed analytics
        </Button>
      </Card>
    </div>
  );
};

export default AnalyticsCard;
