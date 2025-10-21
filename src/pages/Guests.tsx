import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone } from "lucide-react";
import { AddGuestDialog } from "@/components/AddGuestDialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export default function Guests() {
  const navigate = useNavigate();
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
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between animate-slide-in">
        <div className="space-y-2">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient" style={{ backgroundSize: '200% auto' }}>
            Guests
          </h2>
          <p className="text-muted-foreground text-lg">View and manage guest information</p>
        </div>
        <div className="animate-scale-in">
          <AddGuestDialog />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {guests.length === 0 ? (
          <Card className="col-span-full p-12 text-center animate-scale-in">
            <div className="flex flex-col items-center gap-4">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center animate-float">
                <Mail className="h-10 w-10 text-primary" />
              </div>
              <p className="text-muted-foreground text-lg">No guests found. Add your first guest!</p>
            </div>
          </Card>
        ) : (
          guests.map((guest: any, index: number) => (
            <Card 
              key={guest.id} 
              className="group p-6 card-3d cursor-pointer overflow-hidden"
              style={{ 
                boxShadow: "var(--shadow-elegant)",
                animationDelay: `${index * 0.1}s`,
                animationFillMode: 'both'
              }}
              onClick={() => navigate(`/guests/${guest.id}`)}
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-all duration-500" />
              
              <div className="flex items-start gap-4 relative">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
                  <Avatar className="h-20 w-20 border-2 border-primary/20 group-hover:border-primary/40 transition-all duration-300 group-hover:scale-110 relative z-10">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-xl font-bold text-primary-foreground">
                      {guest.name.split(" ").map((n: string) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                </div>
                
                <div className="flex-1 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-xl text-foreground group-hover:text-primary transition-colors duration-300">{guest.name}</h3>
                    </div>
                    <Badge 
                      variant={guest.status === "active" ? "default" : "secondary"}
                      className="shadow-md group-hover:scale-110 transition-transform duration-300"
                    >
                      {guest.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-2 rounded-lg bg-primary/5 border border-primary/10 group-hover:bg-primary/10 transition-all duration-300">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Mail className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm font-medium text-foreground">{guest.email}</span>
                    </div>
                    <div className="flex items-center gap-3 p-2 rounded-lg bg-accent/5 border border-accent/10 group-hover:bg-accent/10 transition-all duration-300">
                      <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Phone className="h-4 w-4 text-accent" />
                      </div>
                      <span className="text-sm font-medium text-foreground">{guest.phone}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-end pt-3 border-t border-border/50">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-accent group-hover:text-primary-foreground transition-all duration-300 group-hover:scale-105 shadow-md"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/guests/${guest.id}`);
                      }}
                    >
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
