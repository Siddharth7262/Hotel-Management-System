import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Rooms from "./pages/Rooms";
import RoomDetail from "./pages/RoomDetail";
import Bookings from "./pages/Bookings";
import BookingDetail from "./pages/BookingDetail";
import Guests from "./pages/Guests";
import GuestDetail from "./pages/GuestDetail";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { Sidebar } from "./components/Sidebar";

const queryClient = new QueryClient();

const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex min-h-screen bg-background">
    <Sidebar />
    <main className="flex-1 overflow-auto p-8">
      {children}
    </main>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout><Index /></Layout>} />
          <Route path="/rooms" element={<Layout><Rooms /></Layout>} />
          <Route path="/rooms/:id" element={<Layout><RoomDetail /></Layout>} />
          <Route path="/bookings" element={<Layout><Bookings /></Layout>} />
          <Route path="/bookings/:id" element={<Layout><BookingDetail /></Layout>} />
          <Route path="/guests" element={<Layout><Guests /></Layout>} />
          <Route path="/guests/:id" element={<Layout><GuestDetail /></Layout>} />
          <Route path="/settings" element={<Layout><Settings /></Layout>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
