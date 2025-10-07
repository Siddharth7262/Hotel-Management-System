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

export function AddRoomDialog() {
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const roomData = {
      roomNumber: formData.get("roomNumber"),
      type: formData.get("type"),
      floor: formData.get("floor"),
      capacity: formData.get("capacity"),
      price: formData.get("price"),
    };
    
    toast({
      title: "Room Added Successfully",
      description: `Room ${roomData.roomNumber} has been added to the system.`,
    });
    
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-primary to-accent">Add New Room</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Room</DialogTitle>
          <DialogDescription>
            Enter the details for the new room. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="roomNumber">Room Number</Label>
            <Input id="roomNumber" name="roomNumber" placeholder="101" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Room Type</Label>
            <Select name="type" required>
              <SelectTrigger>
                <SelectValue placeholder="Select room type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard Room</SelectItem>
                <SelectItem value="deluxe">Deluxe Room</SelectItem>
                <SelectItem value="executive">Executive Suite</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="floor">Floor</Label>
              <Input id="floor" name="floor" type="number" placeholder="1" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity</Label>
              <Input id="capacity" name="capacity" type="number" placeholder="2" required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Price per Night ($)</Label>
            <Input id="price" name="price" type="number" placeholder="120" required />
          </div>
          <Button type="submit" className="w-full bg-gradient-to-r from-primary to-accent">
            Add Room
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
