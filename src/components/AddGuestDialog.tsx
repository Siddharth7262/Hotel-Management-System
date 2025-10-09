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
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { guestSchema } from "@/lib/validations";

export function AddGuestDialog() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      // Validate input
      const validatedData = guestSchema.parse({
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        status: 'active'
      });
      
      const { error } = await supabase.from('guests').insert({
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        status: validatedData.status
      });
      
      if (error) throw error;
      
      toast({
        title: "Guest Added Successfully",
        description: `${validatedData.name} has been added to the guest list.`,
      });
      
      queryClient.invalidateQueries({ queryKey: ['guests'] });
      setOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.errors?.[0]?.message || error.message || "Failed to add guest",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-primary to-accent">Add Guest</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Guest</DialogTitle>
          <DialogDescription>
            Enter the guest details. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" name="name" placeholder="John Smith" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="john@email.com" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" name="phone" type="tel" placeholder="+1 (555) 123-4567" required />
          </div>
          <Button type="submit" className="w-full bg-gradient-to-r from-primary to-accent">
            Add Guest
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
