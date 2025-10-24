import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { Sun, Moon, Home, Bed, Calendar, Users, Settings, BarChart3, CalendarDays, LogOut, Search } from "lucide-react";
import { useTheme } from "next-themes";

type Action = {
  id: string;
  label: string;
  shortcut?: string;
  icon?: JSX.Element;
  run: () => void;
};

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { theme, setTheme, resolvedTheme } = useTheme();

  const toggle = useCallback(() => setOpen((v) => !v), []);
  const openPalette = useCallback(() => setOpen(true), []);
  const closePalette = useCallback(() => setOpen(false), []);

  // Global keyboard shortcut: Cmd/Ctrl + K
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        toggle();
      }
      if (e.key === "Escape") {
        closePalette();
      }
    };

    // Custom event for programmatic open
    const onOpenEvent = () => openPalette();

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("toggle-command-palette", onOpenEvent as EventListener);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("toggle-command-palette", onOpenEvent as EventListener);
    };
  }, [toggle, openPalette, closePalette]);

  const isDark = (theme ?? resolvedTheme) === "dark";

  const navigateAction = (path: string) => () => {
    navigate(path);
    closePalette();
  };

  const actions: Action[] = [
    { id: "dashboard", label: "Go to Dashboard", icon: <Home className="h-4 w-4" />, shortcut: "G D", run: navigateAction("/") },
    { id: "rooms", label: "Go to Rooms", icon: <Bed className="h-4 w-4" />, shortcut: "G R", run: navigateAction("/rooms") },
    { id: "bookings", label: "Go to Bookings", icon: <Calendar className="h-4 w-4" />, shortcut: "G B", run: navigateAction("/bookings") },
    { id: "guests", label: "Go to Guests", icon: <Users className="h-4 w-4" />, shortcut: "G U", run: navigateAction("/guests") },
    { id: "calendar", label: "Go to Calendar", icon: <CalendarDays className="h-4 w-4" />, run: navigateAction("/calendar") },
    { id: "analytics", label: "Go to Analytics", icon: <BarChart3 className="h-4 w-4" />, run: navigateAction("/analytics") },
    { id: "settings", label: "Open Settings", icon: <Settings className="h-4 w-4" />, shortcut: "G S", run: navigateAction("/settings") },
  ];

  const systemActions: Action[] = [
    {
      id: "toggle-theme",
      label: isDark ? "Switch to Light theme" : "Switch to Dark theme",
      icon: isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />,
      shortcut: "T",
      run: () => {
        setTheme(isDark ? "light" : "dark");
        closePalette();
      },
    },
    {
      id: "sign-out",
      label: "Sign out",
      icon: <LogOut className="h-4 w-4" />,
      run: () => {
        closePalette();
        signOut();
      },
    },
  ];

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search or type a command... (Try: Rooms, Bookings, Guests)" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Navigation">
          {actions.map((a) => (
            <CommandItem key={a.id} onSelect={a.run}>
              {a.icon}
              <span className="ml-2">{a.label}</span>
              {a.shortcut ? <CommandShortcut>{a.shortcut}</CommandShortcut> : null}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="System">
          {systemActions.map((a) => (
            <CommandItem key={a.id} onSelect={a.run}>
              {a.icon}
              <span className="ml-2">{a.label}</span>
              {a.shortcut ? <CommandShortcut>{a.shortcut}</CommandShortcut> : null}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

/**
 * Helper to trigger the palette from anywhere
 */
export function openCommandPalette() {
  window.dispatchEvent(new CustomEvent("toggle-command-palette"));
}

/**
 * Small button that can sit in a toolbar to open the palette.
 */
export function CommandButton() {
  return (
    <button
      type="button"
      onClick={() => openCommandPalette()}
      className="group relative inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/40 transition-all"
      aria-label="Open command palette"
    >
      <Search className="h-4 w-4 opacity-70 group-hover:opacity-100" />
      <span className="hidden sm:inline">Search / Command</span>
      <kbd className="ml-2 hidden sm:inline rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground border">
        ⌘K
      </kbd>
    </button>
  );
}