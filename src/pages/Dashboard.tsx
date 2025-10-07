import { StatCard } from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, Bed, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const recentBookings = [
  { id: 1, guest: "John Smith", room: "Deluxe Suite 301", checkIn: "2025-10-08", status: "confirmed" },
  { id: 2, guest: "Sarah Johnson", room: "Standard Room 102", checkIn: "2025-10-10", status: "confirmed" },
  { id: 3, guest: "Michael Brown", room: "Executive Room 205", checkIn: "2025-10-12", status: "pending" },
  { id: 4, guest: "Emily Davis", room: "Deluxe Suite 402", checkIn: "2025-10-15", status: "confirmed" },
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Dashboard</h2>
        <p className="text-muted-foreground">Welcome back! Here's your hotel overview.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value="$48,394"
          change="+12.5% from last month"
          changeType="increase"
          icon={DollarSign}
        />
        <StatCard
          title="Occupancy Rate"
          value="78%"
          change="+5.2% from last month"
          changeType="increase"
          icon={TrendingUp}
        />
        <StatCard
          title="Total Guests"
          value="1,234"
          change="+8.1% from last month"
          changeType="increase"
          icon={Users}
        />
        <StatCard
          title="Available Rooms"
          value="28"
          change="-3 from yesterday"
          changeType="decrease"
          icon={Bed}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card style={{ boxShadow: "var(--shadow-elegant)" }}>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">{booking.guest}</p>
                    <p className="text-sm text-muted-foreground">{booking.room}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-sm text-muted-foreground">{booking.checkIn}</p>
                    <Badge variant={booking.status === "confirmed" ? "default" : "secondary"}>
                      {booking.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card style={{ boxShadow: "var(--shadow-elegant)" }}>
          <CardHeader>
            <CardTitle>Room Status Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-success" />
                  <span className="text-sm font-medium">Available</span>
                </div>
                <span className="text-2xl font-bold text-foreground">28</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-destructive" />
                  <span className="text-sm font-medium">Occupied</span>
                </div>
                <span className="text-2xl font-bold text-foreground">65</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-warning" />
                  <span className="text-sm font-medium">Maintenance</span>
                </div>
                <span className="text-2xl font-bold text-foreground">7</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
