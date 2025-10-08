import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone } from "lucide-react";
import { AddGuestDialog } from "@/components/AddGuestDialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function Guests() {
  const { data: guests = [] } = useQuery({
    queryKey: ['guests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Guests</h2>
          <p className="text-muted-foreground">View and manage guest information</p>
        </div>
        <AddGuestDialog />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {guests.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <p className="text-muted-foreground">No guests found. Add your first guest!</p>
          </div>
        ) : (
          guests.map((guest: any) => (
            <Card key={guest.id} className="p-6 transition-all hover:shadow-lg" style={{ boxShadow: "var(--shadow-elegant)" }}>
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-lg font-semibold text-primary-foreground">
                    {guest.name.split(" ").map((n: string) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg text-foreground">{guest.name}</h3>
                    </div>
                    <Badge variant={guest.status === "active" ? "default" : "secondary"}>
                      {guest.status}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span>{guest.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{guest.phone}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-end pt-2 border-t">
                    <Button variant="outline" size="sm">
                      View Profile
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
