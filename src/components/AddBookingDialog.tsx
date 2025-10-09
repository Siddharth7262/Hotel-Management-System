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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      const checkIn = formData.get("checkIn") as string;
      const checkOut = formData.get("checkOut") as string;
      const room = rooms.find(r => r.id === selectedRoom);
      
      const days = Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24));
      const totalAmount = room ? room.price * days : 0;
      
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
        <Button className="bg-gradient-to-r from-primary to-accent">New Booking</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Booking</DialogTitle>
          <DialogDescription>
            Enter the booking details. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="guest">Guest</Label>
            <Select name="guest" value={selectedGuest} onValueChange={setSelectedGuest} required>
              <SelectTrigger>
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
          <div className="space-y-2">
            <Label htmlFor="room">Room</Label>
            <Select name="room" value={selectedRoom} onValueChange={setSelectedRoom} required>
              <SelectTrigger>
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
            <div className="space-y-2">
              <Label htmlFor="checkIn">Check-in Date</Label>
              <Input id="checkIn" name="checkIn" type="date" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="checkOut">Check-out Date</Label>
              <Input id="checkOut" name="checkOut" type="date" required />
            </div>
          </div>
          <Button type="submit" className="w-full bg-gradient-to-r from-primary to-accent">
            Create Booking
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
