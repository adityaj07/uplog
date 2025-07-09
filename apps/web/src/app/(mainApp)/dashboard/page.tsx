"use client";

import { Separator } from "@/components/ui/separator";
import { type FC } from "react";
import AnalyticsCard from "./_components/analytics-card";
import GreetingCard from "./_components/greeting-card";
import RecentChangelogsCard from "./_components/recent-changelogs-card";
import TeamActivityCard from "./_components/team-activity-card";
import UpcomingChangelogs from "./_components/upcoming-changlogs-card";

// Mock data - replace with actual data later
const mockChangelogs = [
  {
    id: 1,
    title: "New Dashboard Analytics",
    description: "Enhanced analytics with real-time data visualization",
    date: "2 hours ago",
    type: "feature",
    version: "v2.1.0",
    reactions: {
      thumbsUp: 12,
      heart: 5,
      fire: 8,
    },
  },

  {
    id: 2,
    title: "Branding Customization Fix",
    description: "Resolved layout issues in subdomain pages",
    date: "1 day ago",
    type: "bugfix",
    version: "v1.2.5",
  },
  {
    id: 3,
    title: "Faster Publish Flow",
    description: "Improved changelog publish experience",
    date: "3 days ago",
    type: "improvement",
    version: "v1.2.4",
  },
  {
    id: 4,
    title: "Faster Publish Flow",
    description: "Improved changelog publish experience",
    date: "3 days ago",
    type: "improvement",
    version: "v1.2.4",
  },
  {
    id: 5,
    title: "Faster Publish Flow",
    description: "Improved changelog publish experience",
    date: "3 days ago",
    type: "improvement",
    version: "v1.2.4",
  },
];

const mockUpcoming = [
  {
    id: 1,
    title: "Scheduled Changelog: v1.4.0",
    description:
      "Releasing new analytics panel Releasing new analytics panel Releasing new analytics panel Releasing new analytics panel",
    date: "Tomorrow, 10:00 AM",
    type: "release",
    priority: "high",
  },
  {
    id: 2,
    title: "Security Patch",
    description: "Critical vulnerability fix",
    date: "Jul 12, 2:00 AM",
    type: "maintenance",
    priority: "medium",
  },
  {
    id: 3,
    title: "Feedback Widget Launch",
    description: "Users can leave direct feedback",
    date: "Jul 15, 9:00 AM",
    type: "feature",
    priority: "high",
  },
];

const mockActivityLogs = [
  {
    id: 1,
    user: "Aditya Joshi",
    action: "Published changelog",
    target: "Dark Mode Support",
    timestamp: "10 minutes ago",
    type: "publish",
  },
  {
    id: 2,
    user: "Tanisha Roy",
    action: "Edited company settings",
    target: "Uplog Branding",
    timestamp: "25 minutes ago",
    type: "edit",
  },
  {
    id: 3,
    user: "Vivek Singh",
    action: "Invited new member",
    target: "John Doe",
    timestamp: "1 hour ago",
    type: "invite",
  },
];

const mockAnalytics = {
  totalChangelogs: 48,
  publicViews: 1223,
  publishedThisMonth: 12,
  scheduled: 5,
  publishingVelocity: 80,
  contributorActivity: 92,
  reactions: {
    thumbsUp: 12,
    heart: 5,
    fire: 8,
  },
};

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <div className="space-y-6">
      <GreetingCard className="my-2" />

      <Separator className="!my-3 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent mb-2" />

      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 mt-5">
        <div className="lg:col-span-7 mb-5">
          <div className="space-y-6 pr-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <RecentChangelogsCard latestChangelogs={mockChangelogs} />

              <UpcomingChangelogs upcomingChangelogs={mockUpcoming} />
            </div>

            <TeamActivityCard teamActivities={mockActivityLogs} />
          </div>
        </div>

        <div className="lg:col-span-3">
          <AnalyticsCard analyticsLogs={mockAnalytics} />
        </div>
      </div>
    </div>
  );
};

export default page;
