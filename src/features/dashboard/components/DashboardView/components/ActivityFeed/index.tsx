import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { ScrollArea } from "@/components/ui/ScrollArea";
import type { ActivityEvent } from "@/features/dashboard/types";
import { ActivityItem } from "./components";

interface ActivityFeedProps {
  events: ReadonlyArray<ActivityEvent>;
}

export function ActivityFeed({ events }: ActivityFeedProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Recent activity</CardTitle>
        <CardDescription>
          Last events recorded across your fleet within the selected window.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        {events.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No activity in the selected window.
          </p>
        ) : (
          <ScrollArea maxHeight="22rem">
            <ul className="divide-y divide-border">
              {events.map((event) => (
                <ActivityItem key={event.id} event={event} />
              ))}
            </ul>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
