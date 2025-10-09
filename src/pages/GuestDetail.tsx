import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Mail, Phone, Calendar } from "lucide-react";

export default function GuestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: guest, isLoading } = useQuery({
    queryKey: ['guest', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Button variant="ghost" onClick={() => navigate('/guests')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Guests
        </Button>
        <p className="text-muted-foreground">Loading guest details...</p>
      </div>
    );
  }

  if (!guest) {
    return (
      <div className="space-y-8">
        <Button variant="ghost" onClick={() => navigate('/guests')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Guests
        </Button>
        <p className="text-muted-foreground">Guest not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Button variant="ghost" onClick={() => navigate('/guests')}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Guests
      </Button>

      <div className="flex items-center gap-6">
        <Avatar className="h-24 w-24">
          <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-2xl font-semibold text-primary-foreground">
            {guest.name.split(" ").map((n: string) => n[0]).join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-3xl font-bold text-foreground">{guest.name}</h2>
          <Badge variant={guest.status === "active" ? "default" : "secondary"} className="mt-2">
            {guest.status}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{guest.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{guest.phone}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Member Since</p>
                <p className="font-medium">{new Date(guest.created_at).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="font-medium">{new Date(guest.updated_at).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
