import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, User, Bed, DollarSign } from "lucide-react";

export default function BookingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: booking, isLoading } = useQuery({
    queryKey: ['booking', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          guests(name, email, phone),
          rooms(room_number, type, floor, price)
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Button variant="ghost" onClick={() => navigate('/bookings')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Bookings
        </Button>
        <p className="text-muted-foreground">Loading booking details...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="space-y-8">
        <Button variant="ghost" onClick={() => navigate('/bookings')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Bookings
        </Button>
        <p className="text-muted-foreground">Booking not found</p>
      </div>
    );
  }

  const nights = Math.ceil(
    (new Date(booking.check_out).getTime() - new Date(booking.check_in).getTime()) / 
    (1000 * 60 * 60 * 24)
  );

  return (
    <div className="space-y-8">
      <Button variant="ghost" onClick={() => navigate('/bookings')}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Bookings
      </Button>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Booking Details</h2>
          <p className="text-muted-foreground">Complete booking information</p>
        </div>
        <Badge variant={booking.status === "confirmed" ? "default" : "secondary"}>
          {booking.status}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Guest Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Guest Name</p>
                <p className="font-medium">{booking.guests?.name}</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{booking.guests?.email}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium">{booking.guests?.phone}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Room Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Bed className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Room</p>
                <p className="font-medium">{booking.rooms?.type} - Room {booking.rooms?.room_number}</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Floor</p>
              <p className="font-medium">Floor {booking.rooms?.floor}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Price per Night</p>
              <p className="font-medium">${booking.rooms?.price}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stay Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-success" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Check-in</p>
                <p className="font-medium">{new Date(booking.check_in).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-warning" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Check-out</p>
                <p className="font-medium">{new Date(booking.check_out).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Number of Nights</p>
              <p className="font-medium">{nights} nights</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-primary" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="text-3xl font-bold text-primary">${booking.total_amount || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
