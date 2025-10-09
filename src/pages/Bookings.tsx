import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, Bed } from "lucide-react";
import { AddBookingDialog } from "@/components/AddBookingDialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export default function Bookings() {
  const navigate = useNavigate();
  const { data: bookings = [] } = useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          guests(name),
          rooms(room_number, type)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Bookings</h2>
          <p className="text-muted-foreground">Manage reservations and check-ins</p>
        </div>
        <AddBookingDialog />
      </div>

      <div className="space-y-4">
        {bookings.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No bookings found. Create your first booking!</p>
          </Card>
        ) : (
          bookings.map((booking: any) => (
            <Card key={booking.id} className="overflow-hidden transition-all hover:shadow-lg" style={{ boxShadow: "var(--shadow-elegant)" }}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-xl">Booking</CardTitle>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span className="text-sm">{booking.guests?.name}</span>
                    </div>
                  </div>
                  <Badge variant={booking.status === "confirmed" ? "default" : "secondary"}>
                    {booking.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Bed className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Room</p>
                      <p className="font-medium text-foreground">{booking.rooms?.type} {booking.rooms?.room_number}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                      <Calendar className="h-5 w-5 text-success" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Check-in</p>
                      <p className="font-medium text-foreground">{new Date(booking.check_in).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                      <Calendar className="h-5 w-5 text-warning" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Check-out</p>
                      <p className="font-medium text-foreground">{new Date(booking.check_out).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="text-xl font-bold text-primary">${booking.total_amount || 0}</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => navigate(`/bookings/${booking.id}`)}>
                      View
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
