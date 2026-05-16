import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { ScrollArea } from "@/components/ui/ScrollArea";
import type { ActivityEvent } from "@/types/server.types";

import { ActivityItem } from "./components";

import styles from "./styles.module.css";

interface ActivityFeedProps {
  events: ReadonlyArray<ActivityEvent>;
}

export function ActivityFeed({ events }: ActivityFeedProps) {
  return (
    <Card className={styles.card}>
      <CardHeader>
        <CardTitle>Recent activity</CardTitle>
        <CardDescription>
          Last events recorded across your fleet within the selected window.
        </CardDescription>
      </CardHeader>
      <CardContent className={styles.content}>
        {events.length === 0 ? (
          <p className={styles.empty}>No activity in the selected window.</p>
        ) : (
          <ScrollArea maxHeight="22rem">
            <ul className={styles.list}>
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
