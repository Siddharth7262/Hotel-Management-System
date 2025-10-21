import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "increase" | "decrease";
  icon: LucideIcon;
}

export function StatCard({ title, value, change, changeType, icon: Icon }: StatCardProps) {
  return (
    <Card className="group relative overflow-hidden border-0 backdrop-blur-sm transition-all duration-500 hover:scale-[1.05] animate-scale-in card-modern gradient-border" style={{ boxShadow: "var(--shadow-elegant)" }}>
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Rotating decorative circle */}
      <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 blur-2xl group-hover:scale-150 transition-transform duration-700" />
      
      <CardContent className="p-6 relative z-10">
        <div className="flex items-center justify-between">
          <div className="space-y-3 flex-1">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              {title}
              <span className="h-1 w-8 bg-gradient-to-r from-primary to-accent rounded-full" />
            </p>
            <h3 className="text-5xl font-black tracking-tighter bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
              {value}
            </h3>
            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-bold text-xs transition-all duration-300 group-hover:scale-105 ${
                changeType === "increase" 
                  ? "bg-success/10 text-success border border-success/20" 
                  : "bg-destructive/10 text-destructive border border-destructive/20"
              }`}>
                <span className="text-base transition-transform duration-300 group-hover:translate-y-[-2px]">
                  {changeType === "increase" ? "↑" : "↓"}
                </span>
                {change}
              </div>
            </div>
          </div>
          
          {/* Enhanced icon container */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-3xl blur-xl opacity-50 group-hover:opacity-75 animate-pulse-slow" />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-primary via-accent to-primary shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 animate-gradient" style={{ backgroundSize: '200% 200%' }}>
              <Icon className="h-10 w-10 text-primary-foreground drop-shadow-lg" />
            </div>
          </div>
        </div>
      </CardContent>
      
      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </Card>
  );
}
