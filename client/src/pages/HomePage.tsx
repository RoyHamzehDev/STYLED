import { BookHeart, Shirt, Sparkles, UserRound } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { HubCard } from "../components/HubCard";

// Same icons as the top nav, so each section looks the same everywhere.
const HUB_CARDS = [
  { to: "/wardrobe", title: "My Wardrobe", description: "Browse and manage your clothes", icon: Shirt },
  { to: "/outfits/new", title: "Create Outfit", description: "Mix and match your wardrobe", icon: Sparkles },
  { to: "/outfits", title: "Saved Outfits", description: "Revisit your favorite combinations", icon: BookHeart },
  { to: "/profile", title: "Profile", description: "Your account and style preferences", icon: UserRound },
];

export function HomePage() {
  const { user } = useAuth();

  return (
    <div>
      <p className="text-xs font-medium tracking-[0.2em] text-accent-strong uppercase">Welcome back</p>
      <h1 className="mt-2 text-3xl font-semibold md:text-4xl">Hi, {user?.name}</h1>
      <p className="mt-2 text-ink-muted">What would you like to do today?</p>

      {/* One column on mobile, two from the sm breakpoint (640px) up. */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 md:mt-10 md:gap-6">
        {HUB_CARDS.map((card) => (
          <HubCard key={card.to} {...card} />
        ))}
      </div>
    </div>
  );
}
