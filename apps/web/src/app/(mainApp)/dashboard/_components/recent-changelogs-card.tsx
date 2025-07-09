import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Megaphone } from "lucide-react";
import { type FC } from "react";

interface RecentChangelogsCardProps {
  latestChangelogs: {
    id: number;
    title: string;
    description: string;
    date: string;
    type: string;
    version: string;
  }[];
}

const RecentChangelogsCard: FC<RecentChangelogsCardProps> = ({
  latestChangelogs,
}) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">
              Recent Changelogs
            </CardTitle>
            <CardDescription>Latest public or internal updates</CardDescription>
          </div>
          <Megaphone className="w-5 h-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {latestChangelogs.map((log) => (
          <div key={log.id} className="border p-3 rounded-lg">
            <div className="flex justify-between mb-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{log.type}</Badge>
                <Badge variant="outline">{log.version}</Badge>
              </div>
              <span>{log.date}</span>
            </div>
            <p className="text-sm font-medium">{log.title}</p>
            <p className="text-xs text-muted-foreground">{log.description}</p>
          </div>
        ))}
        <div className="pt-2 text-right">
          <Button variant="ghost" size="sm">
            View all changelogs
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentChangelogsCard;
