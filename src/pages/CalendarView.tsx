import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const { data: bookings = [] } = useQuery({
    queryKey: ['calendar-bookings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          guests(name),
          rooms(room_number, type)
        `)
        .order('check_in', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  // Calendar logic
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getBookingsForDate = (day: number) => {
    const date = new Date(year, month, day);
    const dateStr = date.toISOString().split('T')[0];
    
    return bookings.filter((booking: any) => {
      const checkIn = new Date(booking.check_in);
      const checkOut = new Date(booking.check_out);
      return date >= checkIn && date <= checkOut;
    });
  };

  // Generate calendar days
  const calendarDays = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between animate-slide-in">
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse-slow" />
            <h2 className="text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient" style={{ backgroundSize: '200% auto' }}>
              Calendar View
            </h2>
          </div>
          <p className="text-lg text-muted-foreground font-medium">Visual booking calendar and timeline</p>
        </div>
        <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <Filter className="h-5 w-5 mr-2" />
          Filters
        </Button>
      </div>

      {/* Calendar Card */}
      <Card className="card-3d border-0 gradient-border" style={{ boxShadow: "var(--shadow-elegant)" }}>
        <CardHeader className="border-b border-border/50">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-3xl">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center animate-gradient" style={{ backgroundSize: '200% 200%' }}>
                <Calendar className="h-6 w-6 text-white" />
              </div>
              {monthNames[month]} {year}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={previousMonth}
                className="h-12 w-12 rounded-xl hover:scale-110 transition-transform duration-300"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                onClick={() => setCurrentDate(new Date())}
                className="rounded-xl font-semibold hover:scale-105 transition-transform duration-300"
              >
                Today
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={nextMonth}
                className="h-12 w-12 rounded-xl hover:scale-110 transition-transform duration-300"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {dayNames.map((day) => (
              <div
                key={day}
                className="text-center font-bold text-sm text-muted-foreground uppercase tracking-wider py-3 rounded-xl bg-muted/30"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day, index) => {
              if (day === null) {
                return <div key={`empty-${index}`} className="aspect-square" />;
              }

              const bookingsForDay = getBookingsForDate(day);
              const isToday = 
                day === new Date().getDate() &&
                month === new Date().getMonth() &&
                year === new Date().getFullYear();

              return (
                <div
                  key={day}
                  className={`group relative aspect-square p-2 rounded-2xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer ${
                    isToday
                      ? 'border-primary bg-gradient-to-br from-primary/10 to-accent/10 shadow-md'
                      : bookingsForDay.length > 0
                      ? 'border-success/30 bg-success/5 hover:bg-success/10'
                      : 'border-border/50 hover:border-primary/30 hover:bg-primary/5'
                  }`}
                >
                  <div className="flex flex-col h-full">
                    <div className={`text-right font-bold mb-1 ${
                      isToday ? 'text-primary text-lg' : 'text-foreground'
                    }`}>
                      {day}
                    </div>
                    
                    {bookingsForDay.length > 0 && (
                      <div className="flex-1 space-y-1">
                        {bookingsForDay.slice(0, 2).map((booking: any, i: number) => (
                          <div
                            key={i}
                            className="text-xs p-1.5 rounded-lg bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 font-medium truncate hover:scale-105 transition-transform duration-200"
                            title={`${booking.guests?.name} - Room ${booking.rooms?.room_number}`}
                          >
                            {booking.guests?.name?.split(' ')[0]}
                          </div>
                        ))}
                        {bookingsForDay.length > 2 && (
                          <div className="text-xs text-center font-bold text-primary">
                            +{bookingsForDay.length - 2} more
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Tooltip on hover */}
                  {bookingsForDay.length > 0 && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50">
                      <div className="bg-card border border-border rounded-xl shadow-2xl p-3 min-w-[200px]">
                        <p className="font-bold text-sm mb-2">{bookingsForDay.length} Booking(s)</p>
                        <div className="space-y-1">
                          {bookingsForDay.slice(0, 3).map((booking: any, i: number) => (
                            <div key={i} className="text-xs">
                              <p className="font-semibold">{booking.guests?.name}</p>
                              <p className="text-muted-foreground">Room {booking.rooms?.room_number}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card className="border-0 gradient-border" style={{ boxShadow: "var(--shadow-elegant)" }}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center gap-8 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="h-6 w-6 rounded-lg border-2 border-primary bg-gradient-to-br from-primary/10 to-accent/10" />
              <span className="text-sm font-semibold">Today</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-6 w-6 rounded-lg border-2 border-success/30 bg-success/5" />
              <span className="text-sm font-semibold">Has Bookings</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-6 w-6 rounded-lg border-2 border-border/50" />
              <span className="text-sm font-semibold">Available</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
