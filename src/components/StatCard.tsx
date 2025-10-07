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
    <Card className="overflow-hidden transition-all hover:shadow-lg" style={{ boxShadow: "var(--shadow-elegant)" }}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="mt-2 text-3xl font-bold text-foreground">{value}</h3>
            <p className={`mt-2 text-sm font-medium ${changeType === "increase" ? "text-success" : "text-destructive"}`}>
              {change}
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
            <Icon className="h-6 w-6 text-primary-foreground" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
