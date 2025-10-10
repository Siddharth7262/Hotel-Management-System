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
    <Card className="group overflow-hidden border-border/50 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-[var(--shadow-hover)] animate-scale-in" style={{ boxShadow: "var(--shadow-elegant)" }}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{title}</p>
            <h3 className="text-4xl font-bold tracking-tight text-foreground transition-colors duration-300">{value}</h3>
            <p className={`text-sm font-medium flex items-center gap-1 transition-colors duration-300 ${
              changeType === "increase" ? "text-success" : "text-destructive"
            }`}>
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                {changeType === "increase" ? "↑" : "↓"}
              </span>
              {change}
            </p>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-6" style={{ boxShadow: "var(--shadow-soft)" }}>
            <Icon className="h-7 w-7 text-primary-foreground" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
