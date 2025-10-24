import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TrendingUp, DollarSign, CalendarCheck, Award, PieChart } from "lucide-react";
import { BarChart, Bar, LineChart, Line, PieChart as RechartsPie, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Analytics() {
  const { data: rooms = [] } = useQuery({
    queryKey: ['analytics-rooms'],
    queryFn: async () => {
      const { data, error } = await supabase.from('rooms').select('*');
      if (error) throw error;
      return data;
    }
  });

  const { data: bookings = [] } = useQuery({
    queryKey: ['analytics-bookings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('id, check_in, total_amount, status')
        .order('check_in', { ascending: true });
      if (error) throw error;
      return data;
    }
  });

  const { data: payments = [] } = useQuery({
    queryKey: ['analytics-payments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payments')
        .select('amount, paid_at, status');
      if (error) throw error;
      return data;
    }
  });

  // Calculate metrics from payments (paid only)
  const paidPayments = payments.filter((p: any) => p.status === "paid");
  const totalRevenue = paidPayments.reduce((sum: number, p: any) => sum + (parseFloat(p.amount) || 0), 0);
  const avgBookingValue = bookings.length > 0 ? totalRevenue / bookings.length : 0;
  const occupancyRate = rooms.length > 0 ? (rooms.filter((r: any) => r.status === 'occupied').length / rooms.length) * 100 : 0;

  // Room type distribution
  const roomTypeData = rooms.reduce((acc: any, room: any) => {
    const type = room.type || 'Unknown';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});
  const pieData = Object.entries(roomTypeData).map(([name, value]) => ({ name, value }));

  // Monthly aggregates from payments and bookings
  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const monthly = new Map<string, { month: string; revenue: number; bookings: number }>();
  for (const p of paidPayments) {
    const d = new Date(p.paid_at);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const label = `${monthNames[d.getMonth()]} ${String(d.getFullYear()).slice(-2)}`;
    const obj = monthly.get(key) ?? { month: label, revenue: 0, bookings: 0 };
    obj.revenue += Number(p.amount || 0);
    monthly.set(key, obj);
  }
  for (const b of bookings) {
    const d = new Date(b.check_in);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const label = `${monthNames[d.getMonth()]} ${String(d.getFullYear()).slice(-2)}`;
    const obj = monthly.get(key) ?? { month: label, revenue: 0, bookings: 0 };
    obj.bookings += 1;
    monthly.set(key, obj);
  }
  const monthlyData = Array.from(monthly.values()).sort((a, b) => {
    const [am, ay] = a.month.split(" ");
    const [bm, by] = b.month.split(" ");
    return (Number("20"+ay) - Number("20"+by)) || (monthNames.indexOf(am) - monthNames.indexOf(bm));
  });

  const COLORS = ['hsl(195, 85%, 35%)', 'hsl(195, 75%, 45%)', 'hsl(40, 85%, 55%)', 'hsl(145, 65%, 45%)'];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="space-y-3 animate-slide-in">
        <div className="flex items-center gap-4">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse-slow" />
          <h2 className="text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient" style={{ backgroundSize: '200% auto' }}>
            Analytics & Insights
          </h2>
        </div>
        <p className="text-lg text-muted-foreground font-medium">Comprehensive data analysis and performance metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Total Revenue", value: `${totalRevenue.toFixed(2)}`, change: "", icon: DollarSign, color: "from-green-500 to-emerald-500" },
          { title: "Avg Booking", value: `${avgBookingValue.toFixed(0)}`, change: "", icon: TrendingUp, color: "from-blue-500 to-cyan-500" },
          { title: "Occupancy Rate", value: `${occupancyRate.toFixed(1)}%`, change: "", icon: CalendarCheck, color: "from-purple-500 to-pink-500" },
          { title: "Total Bookings", value: bookings.length.toString(), change: "", icon: Award, color: "from-orange-500 to-red-500" },
        ].map((metric, index) => (
          <Card key={index} className="group relative overflow-hidden border-0 backdrop-blur-sm transition-all duration-500 hover:scale-[1.05] animate-scale-in card-modern gradient-border" style={{ boxShadow: "var(--shadow-elegant)", animationDelay: `${index * 0.1}s` }}>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 blur-2xl group-hover:scale-150 transition-transform duration-700" />
            
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div className="space-y-2 flex-1">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{metric.title}</p>
                  <h3 className="text-4xl font-black tracking-tighter bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                    {metric.value}
                  </h3>
                </div>
                
                <div className="relative">
                  <div className={`absolute inset-0 bg-gradient-to-br ${metric.color} rounded-3xl blur-xl opacity-50 animate-pulse-slow`} />
                  <div className={`relative flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br ${metric.color} shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-12`}>
                    <metric.icon className="h-8 w-8 text-white drop-shadow-lg" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Trend */}
        <Card className="group card-3d border-0 gradient-border" style={{ boxShadow: "var(--shadow-elegant)" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              Revenue Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="hsl(195, 85%, 35%)" strokeWidth={3} dot={{ fill: 'hsl(195, 85%, 35%)', r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bookings by Month */}
        <Card className="group card-3d border-0 gradient-border" style={{ boxShadow: "var(--shadow-elegant)" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-success/20 to-warning/20 flex items-center justify-center">
                <CalendarCheck className="h-5 w-5 text-success" />
              </div>
              Monthly Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                <Legend />
                <Bar dataKey="bookings" fill="hsl(195, 75%, 45%)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Room Distribution */}
        <Card className="group card-3d border-0 gradient-border" style={{ boxShadow: "var(--shadow-elegant)" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                <PieChart className="h-5 w-5 text-purple-500" />
              </div>
              Room Type Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPie>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPie>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Performers */}
        <Card className="group card-3d border-0 gradient-border" style={{ boxShadow: "var(--shadow-elegant)" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center">
                <Award className="h-5 w-5 text-yellow-500" />
              </div>
              Top Performing Rooms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {rooms.slice(0, 5).map((room: any, index: number) => (
                <div key={room.id} className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 border border-border/50 hover:scale-[1.02] transition-transform duration-300">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold shadow-lg">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-bold text-foreground">Room {room.room_number}</p>
                      <p className="text-sm text-muted-foreground">{room.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      ${room.price}
                    </p>
                    <p className="text-xs text-muted-foreground">per night</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
