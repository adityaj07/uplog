"use client";

import { format } from "date-fns";
import { Flame, Heart, ThumbsUp } from "lucide-react";
import React, { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Types
export type Changelog = {
  id: number;
  title: string;
  description?: string;
  date: string;
  type: "feature" | "bugfix" | "improvement" | string;
  version?: string;
  reactions?: {
    thumbsUp: number;
    heart: number;
    fire: number;
  };
};

// Icons per changelog type
const typeIconMap: Record<string, string> = {
  feature: "✨",
  bugfix: "🐛",
  improvement: "🛠️",
};

// Page Header
const PageHeader = ({ title }: { title: string }) => (
  <div className="mb-6">
    <h1 className="text-2xl font-bold text-foreground dark:text-white">
      {title}
    </h1>
  </div>
);

// ChangelogCard
const ChangelogCard = ({ log }: { log: Changelog }) => {
  const icon = typeIconMap[log.type] || "📦";
  const desc = log.description || "No description provided.";

  return (
    <Card className="bg-background p-4 shadow-md rounded-2xl mb-4">
      <CardContent className="space-y-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-lg">{icon}</span>
            <h2 className="font-semibold text-lg text-foreground">
              {log.title}
            </h2>
          </div>
          {log.version && <Badge variant="outline">v{log.version}</Badge>}
        </div>

        <p className="text-muted-foreground line-clamp-2 text-sm">{desc}</p>

        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <span>{format(new Date(log.date), "PPP")}</span>
          <Badge>{log.type}</Badge>
        </div>

        <div className="flex gap-4 pt-2 neumorphic rounded-lg px-3 py-1 bg-muted/20">
          <div title={`${log.reactions?.thumbsUp || 0} liked this 👍`}>
            <ThumbsUp className="inline h-4 w-4 mr-1" />
            {log.reactions?.thumbsUp || 0}
          </div>
          <div title={`${log.reactions?.heart || 0} loved this ❤️`}>
            <Heart className="inline h-4 w-4 mr-1" />
            {log.reactions?.heart || 0}
          </div>
          <div title={`${log.reactions?.fire || 0} found this hot 🔥`}>
            <Flame className="inline h-4 w-4 mr-1" />
            {log.reactions?.fire || 0}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Skeleton Loader
const ChangelogSkeleton = () => (
  <div className="space-y-4">
    {[...Array(3)].map((_, i) => (
      <Card key={i} className="p-4 rounded-2xl">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-5/6 mb-2" />
        <Skeleton className="h-4 w-1/4" />
      </Card>
    ))}
  </div>
);

// Empty State
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center text-center p-10">
    <div className="text-4xl mb-4">📭</div>
    <p className="text-muted-foreground mb-2">No changelogs yet.</p>
    <Button>Create your first changelog</Button>
  </div>
);

// LoadMoreButton
const LoadMoreButton = ({
  onClick,
  hasMore,
}: {
  onClick: () => void;
  hasMore: boolean;
}) => {
  if (!hasMore) return null;
  return (
    <div className="text-center mt-6">
      <Button variant="secondary" onClick={onClick}>
        Load More
      </Button>
    </div>
  );
};

// Mock fetcher (replace with real API)
const fetchChangelogs = async (
  page: number
): Promise<{ data: Changelog[]; hasMore: boolean }> => {
  await new Promise((res) => setTimeout(res, 800));
  const logs = [...Array(8)].map((_, i) => ({
    id: i + page * 10,
    title: `Sample Changelog #${i + 1 + page * 10}`,
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    date: new Date().toISOString(),
    type: ["feature", "bugfix", "improvement"][i % 3],
    version: `1.${page}.${i}`,
    reactions: { thumbsUp: 10 + i, heart: 5 + i, fire: 2 * i },
  }));
  return { data: logs, hasMore: page < 2 }; // simulate 3 pages only
};

// Main Page
const ChangelogsPage = () => {
  const [logs, setLogs] = useState<Changelog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  React.useEffect(() => {
    fetchChangelogs(0).then(({ data, hasMore }) => {
      setLogs(data);
      setHasMore(hasMore);
      setLoading(false);
    });
  }, []);

  const loadMore = async () => {
    const nextPage = page + 1;
    setLoading(true);
    const { data, hasMore: more } = await fetchChangelogs(nextPage);
    setLogs((prev) => [...prev, ...data]);
    setPage(nextPage);
    setHasMore(more);
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <PageHeader title="All Changelogs" />

      {loading && logs.length === 0 && <ChangelogSkeleton />}
      {!loading && logs.length === 0 && <EmptyState />}

      <div>
        {logs.map((log) => (
          <ChangelogCard key={log.id} log={log} />
        ))}
      </div>

      {loading && logs.length > 0 && <ChangelogSkeleton />}
      <LoadMoreButton onClick={loadMore} hasMore={hasMore} />
    </div>
  );
};

export default ChangelogsPage;
