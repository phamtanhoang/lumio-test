"use client";

import { useEffect, useState } from "react";

import {
  fetchActivities,
  fetchServers,
} from "@/features/dashboard/services";
import type {
  ActivityEvent,
  Server,
} from "@/features/dashboard/types";

interface ServerDataState {
  servers: Server[];
  activities: ActivityEvent[];
  isLoading: boolean;
  error: Error | null;
}

export function useServers(): ServerDataState {
  const [state, setState] = useState<ServerDataState>({
    servers: [],
    activities: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    Promise.all([fetchServers(), fetchActivities()])
      .then(([servers, activities]) => {
        if (cancelled) return;
        setState({ servers, activities, isLoading: false, error: null });
      })
      .catch((error: Error) => {
        if (cancelled) return;
        setState((prev) => ({ ...prev, isLoading: false, error }));
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
