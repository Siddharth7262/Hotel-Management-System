import { StatCard } from "@/components/StatCard";
import { AboutSection } from "@/components/AboutSection";
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
    <div className="space-y-8 animate-fade-in">
      <div className="space-y-2">
        <h2 className="text-4xl font-bold tracking-tight text-foreground">Dashboard</h2>
        <p className="text-lg text-muted-foreground">Welcome back! Here's your hotel overview.</p>
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
        <Card className="border-border/50 backdrop-blur-sm transition-all duration-300 hover:shadow-[var(--shadow-hover)]" style={{ boxShadow: "var(--shadow-elegant)" }}>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bookings.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No bookings yet</p>
              ) : (
                bookings.map((booking: any, index: number) => (
                  <div 
                    key={booking.id} 
                    className="flex items-center justify-between border-b border-border/50 pb-4 last:border-0 transition-all duration-200 hover:bg-muted/50 -mx-2 px-2 rounded-lg"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="space-y-1">
                      <p className="font-semibold text-foreground">{booking.guests?.name}</p>
                      <p className="text-sm text-muted-foreground">{booking.rooms?.type} · Room {booking.rooms?.room_number}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">{new Date(booking.check_in).toLocaleDateString()}</p>
                      <Badge variant={booking.status === "confirmed" ? "default" : "secondary"} className="transition-all duration-200">
                        {booking.status}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 backdrop-blur-sm transition-all duration-300 hover:shadow-[var(--shadow-hover)]" style={{ boxShadow: "var(--shadow-elegant)" }}>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Room Status Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-lg bg-success/5 border border-success/20 transition-all duration-200 hover:bg-success/10">
                <div className="flex items-center gap-3">
                  <div className="h-4 w-4 rounded-full bg-success shadow-lg shadow-success/50" />
                  <span className="text-sm font-semibold text-foreground">Available</span>
                </div>
                <span className="text-3xl font-bold text-success">{availableRooms}</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-destructive/5 border border-destructive/20 transition-all duration-200 hover:bg-destructive/10">
                <div className="flex items-center gap-3">
                  <div className="h-4 w-4 rounded-full bg-destructive shadow-lg shadow-destructive/50" />
                  <span className="text-sm font-semibold text-foreground">Occupied</span>
                </div>
                <span className="text-3xl font-bold text-destructive">{occupiedRooms}</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-warning/5 border border-warning/20 transition-all duration-200 hover:bg-warning/10">
                <div className="flex items-center gap-3">
                  <div className="h-4 w-4 rounded-full bg-warning shadow-lg shadow-warning/50" />
                  <span className="text-sm font-semibold text-foreground">Maintenance</span>
                </div>
                <span className="text-3xl font-bold text-warning">{maintenanceRooms}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* About Section */}
      <div className="mt-12">
        <AboutSection />
      </div>
    </div>
  );
}
