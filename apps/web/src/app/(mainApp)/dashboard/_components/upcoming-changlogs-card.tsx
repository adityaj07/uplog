import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock } from "lucide-react";
import { type FC } from "react";

interface UpcomingChangelogsProps {
  upcomingChangelogs: {
    id: number;
    title: string;
    description: string;
    date: string;
    type: string;
    priority: string;
  }[];
}

const UpcomingChangelogs: FC<UpcomingChangelogsProps> = ({
  upcomingChangelogs,
}) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">
              Scheduled Posts
            </CardTitle>
            <CardDescription>Changelogs set to go live soon</CardDescription>
          </div>
          <Clock className="w-5 h-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {upcomingChangelogs.map((item) => (
          <div key={item.id} className="border p-3 rounded-lg">
            <div className="flex justify-between mb-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Badge variant="outline">{item.type}</Badge>
                <Badge variant="secondary">{item.priority}</Badge>
              </div>
              <span>{item.date}</span>
            </div>
            <p className="text-sm font-medium">{item.title}</p>
            <p className="text-xs text-muted-foreground">{item.description}</p>
          </div>
        ))}
        <div className="pt-2 text-right">
          <Button variant="ghost" size="sm">
            View schedule
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingChangelogs;
