import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertCircle,
  Clock,
  FileText,
  Megaphone,
  TrendingUp,
  Zap,
} from "lucide-react";
import { type FC } from "react";
import ReactionPanel from "./changelogcard-reaction-panel";

interface reactions {
  thumbsUp: number;
  heart: number;
  fire: number;
}
interface RecentChangelogsCardProps {
  latestChangelogs: {
    id: number;
    title: string;
    description: string;
    date: string;
    type: string;
    version: string;
    reactions?: reactions;
  }[];
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case "feature":
      return <Zap className="w-3.5 h-3.5 text-green-600" />;
    case "bugfix":
      return <AlertCircle className="w-3.5 h-3.5 text-red-600" />;
    case "improvement":
      return <TrendingUp className="w-3.5 h-3.5 text-blue-600" />;
    default:
      return <FileText className="w-3.5 h-3.5 text-muted-foreground" />;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case "feature":
      return "bg-green-100 text-green-800";
    case "bugfix":
      return "bg-red-100 text-red-800";
    case "improvement":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-muted text-muted-foreground";
  }
};

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

      <CardContent className="space-y-4">
        {latestChangelogs.length > 0 ? (
          latestChangelogs.map((log) => (
            <div
              key={log.id}
              className="group relative border rounded-lg p-4 transition-all duration-200 hover:bg-accent/40"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-xs">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium ${getTypeColor(
                      log.type
                    )}`}
                  >
                    {getTypeIcon(log.type)}
                    {log.type}
                  </span>
                  <Badge variant="outline" className="rounded-md text-xs">
                    {log.version}
                  </Badge>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{log.date}</span>
                </div>
              </div>

              <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100 leading-snug">
                {log.title}
              </h4>
              <p className="text-xs text-muted-foreground mt-1">
                {log.description}
              </p>
              <ReactionPanel reactions={log.reactions} />
            </div>
          ))
        ) : (
          <div className="text-center py-10">
            <Megaphone className="w-10 h-10 text-muted-foreground mb-2 mx-auto" />
            <p className="text-sm text-muted-foreground">
              No changelogs yet. Start by creating one!
            </p>
          </div>
        )}

        <div className="pt-3 text-right">
          <Button variant="ghost" size="sm">
            View all changelogs
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentChangelogsCard;
