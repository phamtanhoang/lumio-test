import { format } from "date-fns";

const DISPLAY_FORMAT = "dd/MM/yyyy HH:mm:ss";

export function formatDateTime(iso: string): string {
  return format(new Date(iso), DISPLAY_FORMAT);
}

export function formatRelativeDate(iso: string): string {
  return format(new Date(iso), "dd/MM HH:mm");
}
