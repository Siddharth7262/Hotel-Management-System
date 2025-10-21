import { Home, Bed, Calendar, Users, Settings, LogOut, BarChart3, CalendarDays } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Rooms", href: "/rooms", icon: Bed },
  { name: "Bookings", href: "/bookings", icon: Calendar },
  { name: "Guests", href: "/guests", icon: Users },
  { name: "Calendar", href: "/calendar", icon: CalendarDays },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const location = useLocation();
  const { signOut, user } = useAuth();

  return (
    <div className="relative flex h-screen w-64 flex-col border-r border-sidebar-border/50 bg-sidebar shadow-2xl">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-accent/10 to-transparent rounded-full blur-3xl" />
      
      {/* Header */}
      <div className="relative flex h-20 items-center justify-center border-b border-sidebar-border/50 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent blur-xl opacity-30 animate-pulse-slow" />
          <h1 className="relative text-3xl font-black bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent tracking-tight animate-gradient" style={{ backgroundSize: '200% auto' }}>
            HotelHub
          </h1>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="relative flex-1 space-y-2 p-4">
        {navigation.map((item, index) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "group relative flex items-center gap-4 rounded-2xl px-5 py-4 text-sm font-bold transition-all duration-300 animate-slide-in overflow-hidden",
                isActive
                  ? "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-xl scale-[1.03]"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground hover:scale-[1.02] hover:shadow-lg"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Hover effect line */}
              {!isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-r-full" />
              )}
              
              {/* Icon with glow effect */}
              <div className={cn(
                "relative flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300",
                isActive 
                  ? "bg-white/20 shadow-lg" 
                  : "bg-sidebar-accent/30 group-hover:bg-primary/20 group-hover:scale-110"
              )}>
                <item.icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
              </div>
              
              <span className="flex-1">{item.name}</span>
              
              {/* Active indicator */}
              {isActive && (
                <div className="h-2 w-2 rounded-full bg-white shadow-lg animate-pulse-slow" />
              )}
            </Link>
          );
        })}
      </nav>
      
      {/* User section */}
      <div className="relative border-t border-sidebar-border/50 p-4 space-y-3 bg-gradient-to-t from-sidebar-accent/50 to-transparent">
        <div className="relative px-4 py-3 rounded-2xl bg-gradient-to-r from-sidebar-accent/70 to-sidebar-accent/50 border border-sidebar-border/30 overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold shadow-lg">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-sidebar-foreground/70 uppercase tracking-wider">Account</p>
              <p className="text-sm font-semibold text-sidebar-foreground truncate">{user?.email}</p>
            </div>
          </div>
        </div>
        
        <Button 
          variant="ghost" 
          className="relative w-full justify-start text-sidebar-foreground hover:text-destructive font-bold rounded-2xl px-5 py-4 h-auto hover:bg-destructive/10 hover:scale-[1.02] transition-all duration-300 group overflow-hidden"
          onClick={signOut}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-destructive/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative flex items-center justify-center h-10 w-10 rounded-xl bg-destructive/10 group-hover:bg-destructive/20 transition-colors duration-300 mr-3">
            <LogOut className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
          </div>
          <span className="relative">Sign Out</span>
        </Button>
      </div>
    </div>
  );
}
