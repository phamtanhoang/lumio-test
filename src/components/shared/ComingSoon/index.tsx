import { ArrowLeft, Hourglass } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

interface ComingSoonProps {
  title: string;
  description?: ReactNode;
  backHref?: string;
  backLabel?: string;
}

export function ComingSoon({
  title,
  description,
  backHref = "/dashboard",
  backLabel = "Back to dashboard",
}: ComingSoonProps) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 text-center shadow-sm sm:p-10">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Hourglass className="h-6 w-6" aria-hidden />
        </div>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Coming soon
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          {title}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {description ?? "This section is on the roadmap. The dashboard is the only built-out view right now."}
        </p>
        <Link
          href={backHref}
          className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          {backLabel}
        </Link>
      </div>
    </div>
  );
}
