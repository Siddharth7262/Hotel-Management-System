import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AddRoomDialog } from "@/components/AddRoomDialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

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

export default function Rooms() {
  const navigate = useNavigate();
  const { data: rooms = [] } = useQuery({
    queryKey: ['rooms'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .order('room_number');
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Rooms</h2>
          <p className="text-muted-foreground">Manage your hotel rooms and their status</p>
        </div>
        <AddRoomDialog />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {rooms.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <p className="text-muted-foreground">No rooms found. Add your first room!</p>
          </div>
        ) : (
          rooms.map((room: any) => (
            <Card key={room.id} className="overflow-hidden transition-all hover:shadow-lg" style={{ boxShadow: "var(--shadow-elegant)" }}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-xl">Room {room.room_number}</CardTitle>
                  <Badge className={getStatusColor(room.status)}>
                    {room.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="font-medium text-foreground">{room.type}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Floor</p>
                    <p className="font-medium text-foreground">{room.floor}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Capacity</p>
                    <p className="font-medium text-foreground">{room.capacity} guests</p>
                  </div>
                </div>
                <div className="space-y-2 pt-2 border-t">
                  <p className="text-sm text-muted-foreground">Price per night</p>
                  <p className="text-2xl font-bold text-primary">${room.price}</p>
                </div>
                <Button className="w-full mt-4" variant="outline" onClick={() => navigate(`/rooms/${room.id}`)}>
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
