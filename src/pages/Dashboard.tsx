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
    <div className="space-y-8 animate-fade-in relative">
      {/* Animated background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/3 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/3 left-1/3 w-96 h-96 bg-accent/3 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>

      <div className="space-y-3 animate-slide-in">
        <div className="flex items-center gap-4">
          <div className="h-2 w-2 rounded-full bg-success animate-pulse-slow" />
          <h2 className="text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient" style={{ backgroundSize: '200% auto' }}>
            Dashboard
          </h2>
        </div>
        <p className="text-lg text-muted-foreground font-medium">Welcome back! Here's your hotel overview.</p>
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
        <Card className="group border-border/50 backdrop-blur-sm transition-all duration-300 hover:shadow-[var(--shadow-hover)] card-3d animate-scale-in relative overflow-hidden" style={{ boxShadow: "var(--shadow-elegant)", animationDelay: '0.2s' }}>
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-accent/3 opacity-0 group-hover:opacity-100 transition-all duration-500" />
          
          <CardHeader className="relative">
            <CardTitle className="text-2xl font-bold flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Bed className="h-5 w-5 text-primary" />
              </div>
              Recent Bookings
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <div className="space-y-4">
              {bookings.length === 0 ? (
                <div className="text-center py-12">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-4 animate-float">
                    <Bed className="h-8 w-8 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">No bookings yet</p>
                </div>
              ) : (
                bookings.map((booking: any, index: number) => (
                  <div 
                    key={booking.id} 
                    className="group/item flex items-center justify-between border-b border-border/50 pb-4 last:border-0 transition-all duration-300 hover:bg-gradient-to-r hover:from-primary/5 hover:to-accent/5 -mx-2 px-3 py-2 rounded-xl"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="space-y-1.5">
                      <p className="font-bold text-foreground group-hover/item:text-primary transition-colors duration-200">{booking.guests?.name}</p>
                      <p className="text-sm text-muted-foreground font-medium">
                        <span className="inline-flex items-center gap-1.5">
                          <Bed className="h-3.5 w-3.5" />
                          {booking.rooms?.type} · Room {booking.rooms?.room_number}
                        </span>
                      </p>
                    </div>
                    <div className="text-right space-y-2">
                      <p className="text-sm font-semibold text-muted-foreground">{new Date(booking.check_in).toLocaleDateString()}</p>
                      <Badge 
                        variant={booking.status === "confirmed" ? "default" : "secondary"} 
                        className="transition-all duration-300 group-hover/item:scale-105 shadow-md"
                      >
                        {booking.status}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="group border-border/50 backdrop-blur-sm transition-all duration-300 hover:shadow-[var(--shadow-hover)] card-3d animate-scale-in relative overflow-hidden" style={{ boxShadow: "var(--shadow-elegant)", animationDelay: '0.3s' }}>
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-success/3 via-transparent to-warning/3 opacity-0 group-hover:opacity-100 transition-all duration-500" />
          
          <CardHeader className="relative">
            <CardTitle className="text-2xl font-bold flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-success/20 to-warning/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="h-5 w-5 text-success" />
              </div>
              Room Status Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <div className="space-y-5">
              <div className="group/stat flex items-center justify-between p-5 rounded-xl bg-gradient-to-r from-success/10 to-success/5 border-2 border-success/20 transition-all duration-300 hover:border-success/40 hover:scale-[1.02] hover:shadow-lg hover:shadow-success/20">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-success/20 flex items-center justify-center group-hover/stat:scale-110 transition-transform duration-300">
                    <div className="h-5 w-5 rounded-full bg-success shadow-lg shadow-success/50 animate-pulse-slow" />
                  </div>
                  <span className="text-base font-bold text-foreground">Available</span>
                </div>
                <span className="text-4xl font-bold bg-gradient-to-r from-success to-success/70 bg-clip-text text-transparent">{availableRooms}</span>
              </div>
              <div className="group/stat flex items-center justify-between p-5 rounded-xl bg-gradient-to-r from-destructive/10 to-destructive/5 border-2 border-destructive/20 transition-all duration-300 hover:border-destructive/40 hover:scale-[1.02] hover:shadow-lg hover:shadow-destructive/20">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-destructive/20 flex items-center justify-center group-hover/stat:scale-110 transition-transform duration-300">
                    <div className="h-5 w-5 rounded-full bg-destructive shadow-lg shadow-destructive/50 animate-pulse-slow" />
                  </div>
                  <span className="text-base font-bold text-foreground">Occupied</span>
                </div>
                <span className="text-4xl font-bold bg-gradient-to-r from-destructive to-destructive/70 bg-clip-text text-transparent">{occupiedRooms}</span>
              </div>
              <div className="group/stat flex items-center justify-between p-5 rounded-xl bg-gradient-to-r from-warning/10 to-warning/5 border-2 border-warning/20 transition-all duration-300 hover:border-warning/40 hover:scale-[1.02] hover:shadow-lg hover:shadow-warning/20">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-warning/20 flex items-center justify-center group-hover/stat:scale-110 transition-transform duration-300">
                    <div className="h-5 w-5 rounded-full bg-warning shadow-lg shadow-warning/50 animate-pulse-slow" />
                  </div>
                  <span className="text-base font-bold text-foreground">Maintenance</span>
                </div>
                <span className="text-4xl font-bold bg-gradient-to-r from-warning to-warning/70 bg-clip-text text-transparent">{maintenanceRooms}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
