import { Link } from "react-router";
import { ArrowLeft, SearchX } from "lucide-react";

type NotFoundMessageProps = {
  title: string;
  linkTo: string;
  linkLabel: string;
};

// Friendly "this thing doesn't exist" message for a bad or deleted id.
export function NotFoundMessage({ title, linkTo, linkLabel }: NotFoundMessageProps) {
  return (
    <div className="flex flex-col items-center py-10 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-surface text-ink-muted ring-1 ring-border">
        <SearchX className="size-7" strokeWidth={1.5} aria-hidden="true" />
      </span>
      <h2 className="mt-5 text-xl font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-ink-muted">It may have been deleted, or the link is wrong.</p>
      <Link
        to={linkTo}
        className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-control px-3 text-sm font-medium text-accent-strong transition-colors duration-200 hover:bg-accent-soft"
      >
        <ArrowLeft className="size-4" strokeWidth={1.75} aria-hidden="true" />
        {linkLabel}
      </Link>
    </div>
  );
}
