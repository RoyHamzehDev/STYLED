import type { ReactNode } from "react";

type AuthCardProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
};

// Shared by the login and register pages. On large screens an editorial panel
// sits beside the form; on phones and tablets only the form card is shown.
export function AuthCard({ title, subtitle, children, footer }: AuthCardProps) {
  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <div className="grid w-full max-w-sm items-center gap-16 lg:max-w-5xl lg:grid-cols-2">
        {/* Decorative only: hidden from screen readers so they go straight to the form. */}
        <div
          aria-hidden="true"
          className="hidden h-full min-h-[32rem] flex-col justify-between rounded-panel bg-surface p-12 lg:flex"
        >
          <p className="font-display text-lg font-semibold tracking-[0.3em] text-ink">STYLED</p>
          <div>
            <p className="font-display text-5xl leading-tight font-medium text-balance text-ink">
              Your wardrobe, <span className="italic text-accent-strong">curated.</span>
            </p>
            <p className="mt-5 max-w-xs text-base leading-relaxed text-ink-muted">
              Catalogue the clothes you own, build outfits in seconds and keep your favourite looks in one place.
            </p>
          </div>
          <div className="h-1 w-16 rounded-full bg-accent" />
        </div>

        <div className="w-full">
          <p className="text-center font-display text-3xl font-semibold tracking-[0.3em] text-ink lg:hidden">
            STYLED
          </p>

          <div className="mt-8 rounded-panel border border-border bg-background p-6 shadow-lg sm:p-8 lg:mt-0">
            <h1 className="text-3xl font-semibold">{title}</h1>
            <p className="mt-2 text-sm text-ink-muted">{subtitle}</p>
            <div className="mt-8">{children}</div>
          </div>

          <p className="mt-6 text-center text-sm text-ink-muted">{footer}</p>
        </div>
      </div>
    </div>
  );
}
