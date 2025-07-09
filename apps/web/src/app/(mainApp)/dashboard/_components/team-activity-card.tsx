import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Activity } from "lucide-react";
import { type FC } from "react";

interface TeamActivityCardProps {
  teamActivities: {
    id: number;
    user: string;
    action: string;
    target: string;
    timestamp: string;
    type: string;
  }[];
}

const TeamActivityCard: FC<TeamActivityCardProps> = ({ teamActivities }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">
              Team Activity
            </CardTitle>
            <CardDescription>Recent actions by your team</CardDescription>
          </div>
          <Activity className="w-5 h-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {teamActivities.map((log) => (
          <div key={log.id} className="border p-3 rounded-lg">
            <div className="flex justify-between">
              <span className="text-sm font-medium">{log.user}</span>
              <span className="text-xs text-muted-foreground">
                {log.timestamp}
              </span>
            </div>
            <p className="text-sm">
              {log.action} — <span className="text-primary">{log.target}</span>
            </p>
          </div>
        ))}
        <div className="pt-2 text-right">
          <Button variant="ghost" size="sm">
            View activity log
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamActivityCard;
