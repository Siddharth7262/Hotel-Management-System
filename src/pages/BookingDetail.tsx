import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, User, Bed, DollarSign } from "lucide-react";
import { AddPaymentDialog } from "@/components/AddPaymentDialog";
import { AddFeedbackDialog } from "@/components/AddFeedbackDialog";

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

  const { data: payments = [] } = useQuery({
    queryKey: ["booking-payments", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payments")
        .select("*")
        .eq("booking_id", id)
        .order("paid_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: feedback = [] } = useQuery({
    queryKey: ["feedback", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("feedback")
        .select("*")
        .eq("booking_id", id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
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

  const totalPaid = payments
    .filter((p: any) => p.status === "paid")
    .reduce((sum: number, p: any) => sum + Number(p.amount || 0), 0);

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
        <div className="flex items-center gap-2">
          <AddFeedbackDialog bookingId={booking.id} guestId={booking.guest_id} />
          <Badge variant={booking.status === "confirmed" ? "default" : "secondary"}>
            {booking.status}
          </Badge>
        </div>
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
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Payment Information</CardTitle>
            <AddPaymentDialog bookingId={booking.id} />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-primary" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="text-3xl font-bold text-primary">${booking.total_amount || 0}</p>
              </div>
            </div>
            <div className="rounded-xl border p-3">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">Total Paid</div>
                <div className="text-sm font-bold">${totalPaid.toFixed(2)}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">Balance Due</div>
                <div className="text-sm font-bold">
                  ${Math.max(0, Number(booking.total_amount || 0) - totalPaid).toFixed(2)}
                </div>
              </div>
            </div>
            {payments.length > 0 ? (
              <div className="space-y-2">
                <div className="text-sm font-semibold">Payments</div>
                <div className="space-y-2">
                  {payments.map((p: any) => (
                    <div key={p.id} className="flex items-center justify-between rounded-lg border px-3 py-2">
                      <div className="text-sm">
                        <div className="font-medium">{p.method.toUpperCase()} — ${Number(p.amount).toFixed(2)}</div>
                        <div className="text-xs text-muted-foreground">
                          {p.status} • {new Date(p.paid_at).toLocaleString()}
                        </div>
                      </div>
                      <Badge variant={p.status === "paid" ? "default" : "secondary"}>{p.status}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">No payments recorded yet.</div>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Guest Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            {feedback.length === 0 ? (
              <div className="text-sm text-muted-foreground">No feedback submitted yet.</div>
            ) : (
              <div className="space-y-3">
                {feedback.map((f: any) => (
                  <div key={f.id} className="rounded-xl border p-3">
                    <div className="text-sm font-semibold">Rating: {f.rating}/5</div>
                    {f.comments ? <div className="text-sm mt-1">{f.comments}</div> : null}
                    <div className="text-xs text-muted-foreground mt-1">{new Date(f.created_at).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
