import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function Housekeeping() {
  const qc = useQueryClient();
  const { data: rooms = [] } = useQuery({
    queryKey: ["hk-rooms"],
    queryFn: async () => {
      const { data, error } = await supabase.from("rooms").select("id, room_number, type, status, clean_status, needs_maintenance, maintenance_notes");
      if (error) throw error;
      return data;
    },
  });

  const updateRoom = useMutation({
    mutationFn: async (payload: any) => {
      const { id, clean_status, needs_maintenance, maintenance_notes } = payload;
      const { error } = await supabase
        .from("rooms")
        .update({ clean_status, needs_maintenance, maintenance_notes })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["hk-rooms"] });
    },
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="space-y-2">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient" style={{ backgroundSize: '200% auto' }}>
          Housekeeping
        </h2>
        <p className="text-muted-foreground text-lg">Update cleaning and maintenance status</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {rooms.map((room: any) => (
          <Card key={room.id}>
            <CardHeader>
              <CardTitle>Room {room.room_number} — {room.type}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Cleaning Status</div>
                <Select defaultValue={room.clean_status} onValueChange={(v) => updateRoom.mutate({ id: room.id, clean_status: v, needs_maintenance: room.needs_maintenance, maintenance_notes: room.maintenance_notes })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="clean">Clean</SelectItem>
                    <SelectItem value="dirty">Dirty</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Maintenance</div>
                <Select defaultValue={room.needs_maintenance ? "yes" : "no"} onValueChange={(v) => updateRoom.mutate({ id: room.id, clean_status: room.clean_status, needs_maintenance: v === "yes", maintenance_notes: room.maintenance_notes })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="yes">Yes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Notes</div>
                <Textarea
                  defaultValue={room.maintenance_notes ?? ""}
                  onBlur={(e) => updateRoom.mutate({ id: room.id, clean_status: room.clean_status, needs_maintenance: room.needs_maintenance, maintenance_notes: e.currentTarget.value })}
                  placeholder="Leak in bathroom, replace bedsheet, etc."
                />
              </div>
              <Button variant="outline" onClick={() => qc.invalidateQueries({ queryKey: ["hk-rooms"] })}>
                Refresh
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}