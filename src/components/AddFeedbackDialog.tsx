import { useState } from "react";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

type Props = { bookingId?: string; guestId?: string };

export function AddFeedbackDialog({ bookingId, guestId }: Props) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const rating = Number(fd.get("rating"));
    const comments = String(fd.get("comments") || "");
    if (isNaN(rating) || rating < 1 || rating > 5) {
      toast({ title: "Invalid rating", description: "Rating must be between 1 and 5.", variant: "destructive" });
      return;
    }
    try {
      const { error } = await supabase.from("feedback").insert({
        booking_id: bookingId ?? null,
        guest_id: guestId ?? null,
        rating,
        comments,
      });
      if (error) throw error;
      toast({ title: "Feedback submitted", description: "Thanks for your feedback." });
      queryClient.invalidateQueries({ queryKey: ["feedback"] });
      setOpen(false);
    } catch (err: any) {
      toast({ title: "Error", description: err.message ?? "Failed to submit feedback", variant: "destructive" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Feedback</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Submit Feedback</DialogTitle>
          <DialogDescription>Share a quick rating and optional comments.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="rating">Rating (1-5)</Label>
            <Input id="rating" name="rating" type="number" min="1" max="5" required />
          </div>
          <div>
            <Label htmlFor="comments">Comments</Label>
            <Textarea id="comments" name="comments" rows={4} placeholder="Write your feedback..." />
          </div>
          <Button type="submit" className="w-full">Submit</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}