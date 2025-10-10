import { Home, Bed, Calendar, Users, Settings, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Rooms", href: "/rooms", icon: Bed },
  { name: "Bookings", href: "/bookings", icon: Calendar },
  { name: "Guests", href: "/guests", icon: Users },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const location = useLocation();
  const { signOut, user } = useAuth();

  return (
    <div className="flex h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar shadow-lg">
      <div className="flex h-16 items-center border-b border-sidebar-border px-6 bg-gradient-to-r from-primary/5 to-accent/5">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent tracking-tight">
          HotelHub
        </h1>
      </div>
      <nav className="flex-1 space-y-2 p-4">
        {navigation.map((item, index) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 animate-slide-in",
                isActive
                  ? "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg scale-[1.02]"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:scale-[1.02]"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <item.icon className={cn(
                "h-5 w-5 transition-transform duration-200",
                isActive ? "" : "group-hover:scale-110"
              )} />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-sidebar-border p-4 space-y-3 bg-gradient-to-t from-sidebar-accent/30 to-transparent">
        <div className="px-3 py-2 rounded-lg bg-sidebar-accent/50">
          <p className="text-xs font-medium text-sidebar-foreground truncate">{user?.email}</p>
        </div>
        <Button 
          variant="ghost" 
          className="w-full justify-start text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-destructive/10 hover:scale-[1.02] transition-all duration-200"
          onClick={signOut}
        >
          <LogOut className="h-5 w-5 mr-3" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
