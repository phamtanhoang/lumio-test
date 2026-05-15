import { Plus, Search, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/cn";

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex flex-col gap-3 border-b border-border bg-background/85 px-4 py-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:px-6",
        className
      )}
    >
      <div>
        <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
          Demographics Report
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Search"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Search className="h-4 w-4" aria-hidden />
        </button>

        <button
          type="button"
          className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border bg-card px-3.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          <SlidersHorizontal className="h-4 w-4" aria-hidden />
          Customize
        </button>

        <button
          type="button"
          className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border bg-card px-3.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          <Plus className="h-4 w-4" aria-hidden />
          Add New
        </button>
      </div>
    </header>
  );
}
