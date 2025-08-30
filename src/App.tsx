
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import RTLProvider from "@/components/layout/RTLProvider";
import "@/lib/i18n";

import Index from "./pages/Index";
import VenuesPage from "./pages/VenuesPage";
import VenueDetailPage from "./pages/VenueDetailPage";
import CategoriesPage from "./pages/CategoriesPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import RoleSelectionPage from "./pages/RoleSelectionPage";
import DashboardPage from "./pages/DashboardPage";
import EditVenuePage from "./pages/EditVenuePage";
import SettingsPage from "./pages/SettingsPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import MessagesPage from "./pages/MessagesPage";
import HowItWorksPage from "./pages/HowItWorksPage";
import ContactPage from "./pages/ContactPage";
import TermsOfServicePage from "./pages/TermsOfServicePage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import CookiePolicyPage from "./pages/CookiePolicyPage";
import NotFound from "./pages/NotFound";
import AdminDashboardPage from '@/pages/AdminDashboardPage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RTLProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Router>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/venues" element={<VenuesPage />} />
              <Route path="/venues/:id" element={<VenueDetailPage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/categories/:category" element={<VenuesPage />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/terms" element={<TermsOfServicePage />} />
              <Route path="/privacy" element={<PrivacyPolicyPage />} />
              <Route path="/cookies" element={<CookiePolicyPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/select-role" element={<RoleSelectionPage />} />
              <Route path="/dashboard/*" element={<DashboardPage />} />
              <Route path="/dashboard/venues/:id/edit" element={<EditVenuePage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/my-bookings" element={<MyBookingsPage />} />
              <Route path="/messages/*" element={<MessagesPage />} />
              <Route path="/admin/*" element={<AdminDashboardPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </TooltipProvider>
      </AuthProvider>
    </RTLProvider>
    </QueryClientProvider>
  );
}

export default App;
