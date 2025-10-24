import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ThemeToggle } from "./components/ThemeToggle";
import { Separator } from "@/components/ui/separator";
import { CommandPalette, CommandButton } from "./components/CommandPalette";
import { RoleGuard } from "./components/RoleGuard";

// Route-based code splitting
const Index = lazy(() => import("./pages/Index"));
const Rooms = lazy(() => import("./pages/Rooms"));
const RoomDetail = lazy(() => import("./pages/RoomDetail"));
const Bookings = lazy(() => import("./pages/Bookings"));
const BookingDetail = lazy(() => import("./pages/BookingDetail"));
const Guests = lazy(() => import("./pages/Guests"));
const GuestDetail = lazy(() => import("./pages/GuestDetail"));
const Settings = lazy(() => import("./pages/Settings"));
const Auth = lazy(() => import("./pages/Auth"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Analytics = lazy(() => import("./pages/Analytics"));
const CalendarView = lazy(() => import("./pages/CalendarView"));
const Staff = lazy(() => import("./pages/Staff"));
const Housekeeping = lazy(() => import("./pages/Housekeeping"));

const queryClient = new QueryClient();

const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex min-h-screen bg-background">
    <Sidebar />
    <main className="flex-1 overflow-auto p-0">
      {/* App Header */}
      <div className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-background/60 bg-background/80 border-b">
        <div className="mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse-slow" />
            <h2 className="text-lg font-semibold tracking-tight">HotelHub</h2>
          </div>
          <div className="flex items-center gap-2">
            <CommandButton />
            <ThemeToggle />
          </div>
        </div>
      </div>
      <div className="p-8">
        {children}
      </div>
    </main>
    {/* Global command palette lives once per app layout */}
    <CommandPalette />
  </div>
);

const Fallback = () => (
  <div className="p-8 space-y-4">
    <div className="h-8 w-56 bg-muted rounded-xl animate-pulse" />
    <Separator className="my-4" />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-40 rounded-2xl bg-muted animate-pulse" />
      ))}
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <ErrorBoundary>
            <Suspense fallback={<Fallback />}>
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route path="/" element={<ProtectedRoute><Layout><Index /></Layout></ProtectedRoute>} />
                <Route path="/rooms" element={<ProtectedRoute><Layout><Rooms /></Layout></ProtectedRoute>} />
                <Route path="/rooms/:id" element={<ProtectedRoute><Layout><RoomDetail /></Layout></ProtectedRoute>} />
                <Route path="/bookings" element={<ProtectedRoute><Layout><Bookings /></Layout></ProtectedRoute>} />
                <Route path="/bookings/:id" element={<ProtectedRoute><Layout><BookingDetail /></Layout></ProtectedRoute>} />
                <Route path="/guests" element={<ProtectedRoute><Layout><Guests /></Layout></ProtectedRoute>} />
                <Route path="/guests/:id" element={<ProtectedRoute><Layout><GuestDetail /></Layout></ProtectedRoute>} />
                <Route path="/calendar" element={<ProtectedRoute><Layout><CalendarView /></Layout></ProtectedRoute>} />
                <Route path="/analytics" element={<ProtectedRoute><Layout><RoleGuard allow={['admin','manager']}><Analytics /></RoleGuard></Layout></ProtectedRoute>} />
                <Route path="/staff" element={<ProtectedRoute><Layout><RoleGuard allow={['admin']}><Staff /></RoleGuard></Layout></ProtectedRoute>} />
                <Route path="/housekeeping" element={<ProtectedRoute><Layout><RoleGuard allow={['housekeeping','manager','admin']}><Housekeeping /></RoleGuard></Layout></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><Layout><Settings /></Layout></ProtectedRoute>} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
