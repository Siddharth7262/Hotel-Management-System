import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { bookingSchema, guestSchema } from "@/lib/validations";
import { Pencil, Loader2 } from "lucide-react";
import { format } from "date-fns";

interface EditBookingDialogProps {
  bookingId: string;
}

export function EditBookingDialog({ bookingId }: EditBookingDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rooms, setRooms] = useState<any[]>([]);
  const [bookingData, setBookingData] = useState<any>(null);
  const queryClient = useQueryClient();

  // Form state
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [status, setStatus] = useState("confirmed");

  useEffect(() => {
    if (open) {
      loadData();
    }
  }, [open, bookingId]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load booking data with guest and room info
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .select(`
          *,
          guests(*),
          rooms(*)
        `)
        .eq('id', bookingId)
        .single();

      if (bookingError) throw bookingError;

      setBookingData(booking);
      setGuestName(booking.guests?.name || "");
      setGuestEmail(booking.guests?.email || "");
      setGuestPhone(booking.guests?.phone || "");
      setSelectedRoom(booking.room_id);
      setCheckIn(format(new Date(booking.check_in), 'yyyy-MM-dd'));
      setCheckOut(format(new Date(booking.check_out), 'yyyy-MM-dd'));
      setStatus(booking.status);

      // Load available rooms
      const { data: roomsData, error: roomsError } = await supabase
        .from('rooms')
        .select('*')
        .order('room_number');

      if (roomsError) throw roomsError;
      setRooms(roomsData || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load booking data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);

      // Validate guest data
      const guestValidation = guestSchema.safeParse({
        name: guestName,
        email: guestEmail,
        phone: guestPhone,
        status: bookingData.guests?.status || 'active'
      });

      if (!guestValidation.success) {
        toast({
          title: "Validation Error",
          description: guestValidation.error.errors[0].message,
          variant: "destructive",
        });
        return;
      }

      // Calculate total amount
      const selectedRoomData = rooms.find(r => r.id === selectedRoom);
      if (!selectedRoomData) {
        toast({
          title: "Error",
          description: "Please select a valid room",
          variant: "destructive",
        });
        return;
      }

      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
      const totalAmount = selectedRoomData.price * nights;

      // Validate booking data
      const bookingValidation = bookingSchema.safeParse({
        guest_id: bookingData.guest_id,
        room_id: selectedRoom,
        check_in: checkIn,
        check_out: checkOut,
        total_amount: totalAmount,
        status: status
      });

      if (!bookingValidation.success) {
        toast({
          title: "Validation Error",
          description: bookingValidation.error.errors[0].message,
          variant: "destructive",
        });
        return;
      }

      // Update guest information
      const { error: guestError } = await supabase
        .from('guests')
        .update({
          name: guestName,
          email: guestEmail,
          phone: guestPhone,
        })
        .eq('id', bookingData.guest_id);

      if (guestError) throw guestError;

      // Update booking
      const { error: bookingError } = await supabase
        .from('bookings')
        .update({
          room_id: selectedRoom,
          check_in: checkIn,
          check_out: checkOut,
          total_amount: totalAmount,
          status: status
        })
        .eq('id', bookingId);

      if (bookingError) throw bookingError;

      toast({
        title: "Success",
        description: "Booking updated successfully",
      });

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['recent-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['booking', bookingId] });
      
      setOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update booking",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="gap-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <Pencil className="h-4 w-4" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Edit Booking
          </DialogTitle>
        </DialogHeader>
        
        {loading && !bookingData ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Guest Information */}
            <div className="space-y-4 p-4 rounded-lg bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10">
              <h3 className="font-semibold text-lg text-foreground">Guest Information</h3>
              
              <div className="space-y-2">
                <Label htmlFor="guestName" className="text-sm font-medium">
                  Full Name *
                </Label>
                <Input
                  id="guestName"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="John Doe"
                  required
                  className="shadow-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="guestEmail" className="text-sm font-medium">
                  Email Address *
                </Label>
                <Input
                  id="guestEmail"
                  type="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  placeholder="john@example.com"
                  required
                  className="shadow-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="guestPhone" className="text-sm font-medium">
                  Phone Number *
                </Label>
                <Input
                  id="guestPhone"
                  type="tel"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  placeholder="+1 234 567 8900"
                  required
                  className="shadow-sm"
                />
              </div>
            </div>

            {/* Booking Details */}
            <div className="space-y-4 p-4 rounded-lg bg-gradient-to-br from-accent/5 to-primary/5 border border-accent/10">
              <h3 className="font-semibold text-lg text-foreground">Booking Details</h3>
              
              <div className="space-y-2">
                <Label htmlFor="room" className="text-sm font-medium">
                  Room *
                </Label>
                <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                  <SelectTrigger className="shadow-sm">
                    <SelectValue placeholder="Select a room" />
                  </SelectTrigger>
                  <SelectContent>
                    {rooms.map((room) => (
                      <SelectItem key={room.id} value={room.id}>
                        Room {room.room_number} - {room.type} (${room.price}/night)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="checkIn" className="text-sm font-medium">
                    Check-in Date *
                  </Label>
                  <Input
                    id="checkIn"
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    required
                    className="shadow-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="checkOut" className="text-sm font-medium">
                    Check-out Date *
                  </Label>
                  <Input
                    id="checkOut"
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    required
                    className="shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-medium">
                  Status *
                </Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="shadow-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={loading}
                className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all duration-300 shadow-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Booking'
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
