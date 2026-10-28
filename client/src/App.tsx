import { Route, Routes } from "react-router";
import { GuestRoute } from "./components/GuestRoute";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { OutfitBuilderPage } from "./pages/OutfitBuilderPage";
import { OutfitDetailPage } from "./pages/OutfitDetailPage";
import { OutfitsPage } from "./pages/OutfitsPage";
import { HomePage } from "./pages/HomePage";
import { ItemFormPage } from "./pages/ItemFormPage";
import { LoginPage } from "./pages/LoginPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ProfilePage } from "./pages/ProfilePage";
import { RegisterPage } from "./pages/RegisterPage";
import { WardrobePage } from "./pages/WardrobePage";

export default function App() {
  return (
    <Routes>
      {/* Layout route: renders the nav, then the matching child page in its <Outlet />. */}
      <Route element={<Layout />}>
        {/* Logged-in users get redirected away from these. */}
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Everything nested here requires a logged-in user. */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/wardrobe" element={<WardrobePage />} />
          <Route path="/wardrobe/new" element={<ItemFormPage />} />
          <Route path="/wardrobe/:id/edit" element={<ItemFormPage />} />
          <Route path="/outfits/new" element={<OutfitBuilderPage />} />
          <Route path="/outfits" element={<OutfitsPage />} />
          <Route path="/outfits/:id" element={<OutfitDetailPage />} />
          <Route path="/outfits/:id/edit" element={<OutfitBuilderPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
