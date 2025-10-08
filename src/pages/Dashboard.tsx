import { StatCard } from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, Bed, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function Dashboard() {
  const { data: bookings = [] } = useQuery({
    queryKey: ['recent-bookings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          guests(name),
          rooms(room_number, type)
        `)
        .order('created_at', { ascending: false })
        .limit(4);
      
      if (error) throw error;
      return data;
    }
  });

  const { data: rooms = [] } = useQuery({
    queryKey: ['rooms-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rooms')
        .select('status');
      
      if (error) throw error;
      return data;
    }
  });

  const availableRooms = rooms.filter(r => r.status === 'available').length;
  const occupiedRooms = rooms.filter(r => r.status === 'occupied').length;
  const maintenanceRooms = rooms.filter(r => r.status === 'maintenance').length;
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
              {bookings.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No bookings yet</p>
              ) : (
                bookings.map((booking: any) => (
                  <div key={booking.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">{booking.guests?.name}</p>
                      <p className="text-sm text-muted-foreground">{booking.rooms?.type} {booking.rooms?.room_number}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-sm text-muted-foreground">{new Date(booking.check_in).toLocaleDateString()}</p>
                      <Badge variant={booking.status === "confirmed" ? "default" : "secondary"}>
                        {booking.status}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
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
                <span className="text-2xl font-bold text-foreground">{availableRooms}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-destructive" />
                  <span className="text-sm font-medium">Occupied</span>
                </div>
                <span className="text-2xl font-bold text-foreground">{occupiedRooms}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-warning" />
                  <span className="text-sm font-medium">Maintenance</span>
                </div>
                <span className="text-2xl font-bold text-foreground">{maintenanceRooms}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
