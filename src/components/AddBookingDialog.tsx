import { useState } from "react";
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

export function AddBookingDialog() {
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const bookingData = {
      guest: formData.get("guest"),
      room: formData.get("room"),
      checkIn: formData.get("checkIn"),
      checkOut: formData.get("checkOut"),
    };
    
    toast({
      title: "Booking Created Successfully",
      description: `Booking for ${bookingData.guest} has been created.`,
    });
    
    setOpen(false);
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
            <Label htmlFor="guest">Guest Name</Label>
            <Input id="guest" name="guest" placeholder="John Smith" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="room">Room</Label>
            <Select name="room" required>
              <SelectTrigger>
                <SelectValue placeholder="Select a room" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="101">Standard Room 101</SelectItem>
                <SelectItem value="102">Standard Room 102</SelectItem>
                <SelectItem value="201">Deluxe Room 201</SelectItem>
                <SelectItem value="301">Executive Suite 301</SelectItem>
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
