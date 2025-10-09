import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Bed, Users, DollarSign, Building } from "lucide-react";

const getStatusColor = (status: string) => {
  switch (status) {
    case "available":
      return "bg-success text-success-foreground";
    case "occupied":
      return "bg-destructive text-destructive-foreground";
    case "maintenance":
      return "bg-warning text-warning-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export default function RoomDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: room, isLoading } = useQuery({
    queryKey: ['room', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rooms')
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
        <Button variant="ghost" onClick={() => navigate('/rooms')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Rooms
        </Button>
        <p className="text-muted-foreground">Loading room details...</p>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="space-y-8">
        <Button variant="ghost" onClick={() => navigate('/rooms')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Rooms
        </Button>
        <p className="text-muted-foreground">Room not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Button variant="ghost" onClick={() => navigate('/rooms')}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Rooms
      </Button>

      <div>
        <h2 className="text-3xl font-bold text-foreground">Room {room.room_number}</h2>
        <p className="text-muted-foreground">Detailed information about this room</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Room Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Status</span>
              <Badge className={getStatusColor(room.status)}>{room.status}</Badge>
            </div>
            <div className="flex items-center gap-3">
              <Bed className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Room Type</p>
                <p className="font-medium">{room.type}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Building className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Floor</p>
                <p className="font-medium">{room.floor}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Capacity</p>
                <p className="font-medium">{room.capacity} guests</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pricing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Price per night</p>
                <p className="text-3xl font-bold text-primary">${room.price}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
