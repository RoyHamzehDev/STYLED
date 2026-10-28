import { LogOut } from "lucide-react";
import { ProfileForm } from "../components/ProfileForm";
import { ProfileStats } from "../components/ProfileStats";
import { useAuth } from "../hooks/useAuth";

// "Jane Doe" -> "JD", "Jane" -> "J". Shown in the avatar circle.
function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

export function ProfilePage() {
  // ProtectedRoute only renders this page once the user is loaded, so user is set here.
  const { user, logout } = useAuth();
  if (!user) return null;

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex items-center gap-4 md:mb-8 md:gap-5">
        <span
          aria-hidden="true"
          className="flex size-16 shrink-0 items-center justify-center rounded-full bg-accent font-display text-2xl font-semibold text-on-accent shadow-md md:size-20 md:text-3xl"
        >
          {getInitials(user.name)}
        </span>
        <div className="min-w-0">
          <p className="text-xs font-medium tracking-[0.2em] text-accent-strong uppercase">Profile</p>
          <h1 className="mt-1 truncate text-3xl font-semibold md:text-4xl">{user.name}</h1>
        </div>
      </div>

      {/* Desktop: form on the left, summary on the right. Mobile: summary first. */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-8">
        <div className="lg:order-last">
          <ProfileStats />
        </div>
        <ProfileForm user={user} />
      </div>

      <div className="mt-10 border-t border-border pt-6">
        <button
          type="button"
          onClick={logout}
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-control border border-border bg-background px-5 text-sm font-medium text-ink-muted transition-colors duration-200 hover:border-danger/40 hover:bg-danger-soft hover:text-danger disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          <LogOut className="size-4" strokeWidth={1.75} aria-hidden="true" />
          Log out
        </button>
      </div>
    </div>
  );
}
