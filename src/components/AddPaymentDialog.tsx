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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type Props = { bookingId: string };

export function AddPaymentDialog({ bookingId }: Props) {
  const [open, setOpen] = useState(false);
  const [method, setMethod] = useState<string>("cash");
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const amount = Number(fd.get("amount"));
    if (!amount || amount <= 0) {
      toast({ title: "Invalid amount", description: "Please enter a valid amount.", variant: "destructive" });
      return;
    }
    try {
      const { error } = await supabase.from("payments").insert({
        booking_id: bookingId,
        amount,
        method,
        status: "paid",
        paid_at: new Date().toISOString(),
      });
      if (error) throw error;

      toast({ title: "Payment recorded", description: "The payment has been saved." });
      queryClient.invalidateQueries({ queryKey: ["booking", bookingId] });
      queryClient.invalidateQueries({ queryKey: ["booking-payments", bookingId] });
      queryClient.invalidateQueries({ queryKey: ["analytics-payments"] });
      setOpen(false);
    } catch (err: any) {
      toast({ title: "Error", description: err.message ?? "Failed to save payment", variant: "destructive" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90">Add Payment</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Record Payment</DialogTitle>
          <DialogDescription>Enter the payment details for this booking.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input id="amount" name="amount" type="number" min="0" step="0.01" placeholder="0.00" required />
          </div>
          <div className="space-y-2">
            <Label>Method</Label>
            <Select value={method} onValueChange={setMethod}>
              <SelectTrigger><SelectValue placeholder="Select payment method" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="upi">UPI</SelectItem>
                <SelectItem value="transfer">Bank Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full">Save Payment</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}