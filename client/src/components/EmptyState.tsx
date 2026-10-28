import type { ReactNode } from "react";
import { Inbox, type LucideIcon } from "lucide-react";

type EmptyStateProps = {
  title: string;
  message?: string;
  action?: ReactNode;
  icon?: LucideIcon;
};

export function EmptyState({ title, message, action, icon: Icon = Inbox }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center rounded-panel border border-dashed border-border-strong bg-surface px-6 py-14 text-center md:py-20">
      <span className="flex size-16 items-center justify-center rounded-full bg-background text-accent-strong shadow-sm ring-1 ring-border">
        <Icon className="size-7" strokeWidth={1.5} aria-hidden="true" />
      </span>
      <h2 className="mt-5 text-xl font-semibold md:text-2xl">{title}</h2>
      {message && <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-muted">{message}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
