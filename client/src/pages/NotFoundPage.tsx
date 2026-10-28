import { Link } from "react-router";
import { House } from "lucide-react";
import { BUTTON_PRIMARY } from "../utils/buttons";

export function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <p className="font-display text-8xl leading-none font-semibold text-accent-strong md:text-9xl">404</p>
      <div className="mt-6 h-1 w-16 rounded-full bg-accent" aria-hidden="true" />
      <h1 className="mt-6 text-3xl font-semibold text-balance md:text-4xl">This page isn't in the wardrobe</h1>
      <p className="mt-3 max-w-md text-ink-muted">The page you're looking for doesn't exist or was moved.</p>
      <Link to="/" className={`${BUTTON_PRIMARY} mt-8`}>
        <House className="size-4" strokeWidth={1.75} aria-hidden="true" />
        Back to home
      </Link>
    </div>
  );
}
