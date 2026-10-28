import { Link, NavLink, Outlet } from "react-router";
import { BookHeart, LogOut, Shirt, Sparkles, UserRound } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

// `end: true` = active only on that exact URL. /outfits needs it so it isn't
// also highlighted on /outfits/new; /wardrobe stays active on /wardrobe/new.
const NAV_LINKS = [
  { to: "/wardrobe", label: "Wardrobe", end: false, icon: Shirt },
  { to: "/outfits/new", label: "Create Outfit", end: true, icon: Sparkles },
  { to: "/outfits", label: "Saved Outfits", end: true, icon: BookHeart },
  { to: "/profile", label: "Profile", end: true, icon: UserRound },
];

export function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-dvh bg-background">
      {/* Hidden until a keyboard user tabs to it; lets them jump past the nav. */}
      <a
        href="#main"
        className="sr-only z-30 rounded-control bg-ink px-4 py-2 text-sm font-medium text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>

      {/* Nav only appears once the user is loaded, i.e. logged in. */}
      {user && (
        <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-8 gap-y-2 px-4 py-3 sm:px-6 lg:px-8">
            <Link
              to="/"
              className="rounded-control font-display text-2xl font-semibold tracking-[0.3em] text-ink transition-colors duration-200 hover:text-accent-strong"
            >
              STYLED
            </Link>

            {/* On mobile the links drop to their own row (order-last + w-full) and scroll sideways. */}
            <nav
              aria-label="Main"
              className="order-last -mx-1 flex w-full gap-1 overflow-x-auto px-1 pb-1 md:order-none md:w-auto md:flex-1 md:pb-0"
            >
              {NAV_LINKS.map(({ to, label, end, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `flex min-h-11 shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-4 text-sm transition-colors duration-200 ${
                      isActive
                        ? "bg-accent-soft font-medium text-accent-strong"
                        : "text-ink-muted hover:bg-surface hover:text-ink"
                    }`
                  }
                >
                  <Icon className="size-4" strokeWidth={1.75} aria-hidden="true" />
                  {label}
                </NavLink>
              ))}
            </nav>

            <button
              type="button"
              onClick={logout}
              className="ml-auto flex min-h-11 items-center gap-2 rounded-full border border-border px-4 text-sm font-medium text-ink-muted transition-colors duration-200 hover:border-ink-muted hover:text-ink disabled:cursor-not-allowed disabled:opacity-50 md:ml-0"
            >
              <LogOut className="size-4" strokeWidth={1.75} aria-hidden="true" />
              Logout
            </button>
          </div>
        </header>
      )}

      <main id="main" className="mx-auto max-w-6xl px-4 py-6 sm:px-6 md:py-10 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
