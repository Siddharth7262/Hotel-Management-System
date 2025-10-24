import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { bookingSchema } from "@/lib/validations";

export function AddBookingDialog() {
  const [open, setOpen] = useState(false);
  const [guests, setGuests] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [selectedGuest, setSelectedGuest] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const queryClient = useQueryClient();

  useEffect(() => {
    if (open) {
      loadData();
    }
  }, [open]);

  const loadData = async () => {
    const { data: guestsData } = await supabase.from('guests').select('*');
    const { data: roomsData } = await supabase.from('rooms').select('*').eq('status', 'available');
    
    if (guestsData) setGuests(guestsData);
    if (roomsData) setRooms(roomsData);
  };

  const hasOverlap = async (roomId: string, checkIn: string, checkOut: string) => {
    // Find overlapping bookings for the same room (exclude cancelled)
    const { data, error } = await supabase
      .from("bookings")
      .select("id, status, check_in, check_out")
      .eq("room_id", roomId)
      .neq("status", "cancelled")
      .or(`and(check_in.lte.${checkOut},check_out.gte.${checkIn})`);
    if (error) throw error;
    return (data ?? []).length > 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      const checkIn = formData.get("checkIn") as string;
      const checkOut = formData.get("checkOut") as string;
      const room = rooms.find(r => r.id === selectedRoom);
      
      const days = Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24));
      const totalAmount = room ? room.price * Math.max(1, days) : 0;

      // Hard availability check
      const overlap = await hasOverlap(selectedRoom, checkIn, checkOut);
      if (overlap) {
        toast({
          title: "Room not available",
          description: "The selected room is already booked for the chosen dates.",
          variant: "destructive",
        });
        return;
      }
      
      // Validate input
      const validatedData = bookingSchema.parse({
        guest_id: selectedGuest,
        room_id: selectedRoom,
        check_in: checkIn,
        check_out: checkOut,
        status: 'confirmed',
        total_amount: totalAmount
      });
      
      const { error } = await supabase.from('bookings').insert({
        guest_id: validatedData.guest_id,
        room_id: validatedData.room_id,
        check_in: validatedData.check_in,
        check_out: validatedData.check_out,
        status: validatedData.status,
        total_amount: validatedData.total_amount
      });
      
      if (error) throw error;
      
      toast({
        title: "Booking Created Successfully",
        description: `Booking has been created successfully.`,
      });
      
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['recent-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['calendar-bookings'] });
      setOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.errors?.[0]?.message || error.message || "Failed to create booking",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          New Booking
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] animate-scale-in">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Create New Booking
          </DialogTitle>
          <DialogDescription className="text-base">
            Select guest and room, then choose dates. All fields are required.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          <div className="space-y-2 input-group">
            <Label htmlFor="guest" className="text-sm font-semibold">Guest</Label>
            <Select name="guest" value={selectedGuest} onValueChange={setSelectedGuest} required>
              <SelectTrigger className="h-11 transition-all duration-300 focus:scale-[1.02]">
                <SelectValue placeholder="Select a guest" />
              </SelectTrigger>
              <SelectContent>
                {guests.map((guest) => (
                  <SelectItem key={guest.id} value={guest.id}>
                    {guest.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 input-group">
            <Label htmlFor="room" className="text-sm font-semibold">Room</Label>
            <Select name="room" value={selectedRoom} onValueChange={setSelectedRoom} required>
              <SelectTrigger className="h-11 transition-all duration-300 focus:scale-[1.02]">
                <SelectValue placeholder="Select a room" />
              </SelectTrigger>
              <SelectContent>
                {rooms.map((room) => (
                  <SelectItem key={room.id} value={room.id}>
                    {room.type} {room.room_number} - ${room.price}/night
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 input-group">
              <Label htmlFor="checkIn" className="text-sm font-semibold">Check-in Date</Label>
              <Input 
                id="checkIn" 
                name="checkIn" 
                type="date" 
                required 
                className="h-11 transition-all duration-300 focus:scale-[1.02]"
              />
            </div>
            <div className="space-y-2 input-group">
              <Label htmlFor="checkOut" className="text-sm font-semibold">Check-out Date</Label>
              <Input 
                id="checkOut" 
                name="checkOut" 
                type="date" 
                required 
                className="h-11 transition-all duration-300 focus:scale-[1.02]"
              />
            </div>
          </div>
          <Button 
            type="submit" 
            className="w-full h-11 bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] text-base font-semibold"
          >
            Create Booking
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
