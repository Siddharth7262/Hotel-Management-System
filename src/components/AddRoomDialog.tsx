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
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { roomSchema } from "@/lib/validations";

export function AddRoomDialog() {
  const [open, setOpen] = useState(false);
  const [roomType, setRoomType] = useState("");
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      // Validate input
      const validatedData = roomSchema.parse({
        room_number: formData.get("roomNumber"),
        type: roomType,
        floor: formData.get("floor"),
        capacity: formData.get("capacity"),
        price: formData.get("price"),
        status: 'available'
      });
      
      const { error } = await supabase.from('rooms').insert({
        room_number: validatedData.room_number,
        type: validatedData.type,
        floor: validatedData.floor,
        capacity: validatedData.capacity,
        price: validatedData.price,
        status: validatedData.status
      });
      
      if (error) throw error;
      
      toast({
        title: "Room Added Successfully",
        description: `Room ${validatedData.room_number} has been added to the system.`,
      });
      
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      queryClient.invalidateQueries({ queryKey: ['rooms-stats'] });
      setOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.errors?.[0]?.message || error.message || "Failed to add room",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          Add New Room
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] animate-scale-in">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Add New Room
          </DialogTitle>
          <DialogDescription className="text-base">
            Enter the details for the new room. All fields are required.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          <div className="space-y-2 input-group">
            <Label htmlFor="roomNumber" className="text-sm font-semibold">Room Number</Label>
            <Input 
              id="roomNumber" 
              name="roomNumber" 
              placeholder="101" 
              required 
              className="h-11 transition-all duration-300 focus:scale-[1.02]"
            />
          </div>
          <div className="space-y-2 input-group">
            <Label htmlFor="type" className="text-sm font-semibold">Room Type</Label>
            <Select name="type" value={roomType} onValueChange={setRoomType} required>
              <SelectTrigger className="h-11 transition-all duration-300 focus:scale-[1.02]">
                <SelectValue placeholder="Select room type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Standard Room">Standard Room</SelectItem>
                <SelectItem value="Deluxe Room">Deluxe Room</SelectItem>
                <SelectItem value="Executive Suite">Executive Suite</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 input-group">
              <Label htmlFor="floor" className="text-sm font-semibold">Floor</Label>
              <Input 
                id="floor" 
                name="floor" 
                type="number" 
                placeholder="1" 
                required 
                className="h-11 transition-all duration-300 focus:scale-[1.02]"
              />
            </div>
            <div className="space-y-2 input-group">
              <Label htmlFor="capacity" className="text-sm font-semibold">Capacity</Label>
              <Input 
                id="capacity" 
                name="capacity" 
                type="number" 
                placeholder="2" 
                required 
                className="h-11 transition-all duration-300 focus:scale-[1.02]"
              />
            </div>
          </div>
          <div className="space-y-2 input-group">
            <Label htmlFor="price" className="text-sm font-semibold">Price per Night ($)</Label>
            <Input 
              id="price" 
              name="price" 
              type="number" 
              placeholder="120" 
              required 
              className="h-11 transition-all duration-300 focus:scale-[1.02]"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full h-11 bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] text-base font-semibold"
          >
            Add Room
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
