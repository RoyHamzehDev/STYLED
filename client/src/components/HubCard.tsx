import { Link } from "react-router";
import { ArrowUpRight, type LucideIcon } from "lucide-react";

type HubCardProps = {
  to: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

// One large clickable card on the home hub. The whole card is a single link, so
// it is one tab stop and its accessible name is the title + description.
// `group` lets the icon tile and arrow react when any part of the card is hovered.
export function HubCard({ to, title, description, icon: Icon }: HubCardProps) {
  return (
    <Link
      to={to}
      className="group flex min-h-48 flex-col justify-between gap-8 rounded-panel border border-border bg-background p-6 shadow-md transition duration-200 ease-out hover:border-accent hover:shadow-lg motion-safe:hover:-translate-y-0.5 md:min-h-60 md:p-8"
    >
      <div className="flex items-start justify-between">
        <span className="flex size-12 items-center justify-center rounded-card bg-accent-soft text-accent-strong transition-colors duration-200 group-hover:bg-accent group-hover:text-on-accent">
          <Icon className="size-6" strokeWidth={1.75} aria-hidden="true" />
        </span>
        <span className="flex size-10 items-center justify-center rounded-full border border-border text-ink-muted transition duration-200 ease-out group-hover:border-accent group-hover:bg-accent-soft group-hover:text-accent-strong motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5">
          <ArrowUpRight className="size-5" strokeWidth={1.75} aria-hidden="true" />
        </span>
      </div>

      <div>
        <h2 className="text-2xl font-semibold md:text-3xl">{title}</h2>
        <p className="mt-2 max-w-xs text-sm leading-relaxed text-ink-muted md:text-base">{description}</p>
      </div>
    </Link>
  );
}
