import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AddRoomDialog } from "@/components/AddRoomDialog";
import { FilterBar } from "@/components/FilterBar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [appliedFilters, setAppliedFilters] = useState({
    search: "",
    status: "all",
    type: "all",
    priceRange: [0, 1000] as [number, number],
  });

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

  const filteredRooms = useMemo(() => {
    return rooms.filter((room: any) => {
      // Search filter
      if (appliedFilters.search) {
        const searchLower = appliedFilters.search.toLowerCase();
        const matchesSearch =
          room.room_number?.toLowerCase().includes(searchLower) ||
          room.type?.toLowerCase().includes(searchLower) ||
          room.floor?.toString().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Status filter
      if (appliedFilters.status !== "all" && room.status !== appliedFilters.status) {
        return false;
      }

      // Type filter
      if (appliedFilters.type !== "all" && room.type !== appliedFilters.type) {
        return false;
      }

      // Price filter
      const roomPrice = parseFloat(room.price) || 0;
      if (roomPrice < appliedFilters.priceRange[0] || roomPrice > appliedFilters.priceRange[1]) {
        return false;
      }

      return true;
    });
  }, [rooms, appliedFilters]);

  const maxRoomPrice = Math.max(...rooms.map((r: any) => parseFloat(r.price) || 0), 1000);

  const handleApplyFilters = () => {
    setAppliedFilters({
      search: searchQuery,
      status: statusFilter,
      type: typeFilter,
      priceRange: priceRange,
    });
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setTypeFilter("all");
    setPriceRange([0, maxRoomPrice]);
    setAppliedFilters({
      search: "",
      status: "all",
      type: "all",
      priceRange: [0, maxRoomPrice],
    });
  };

  const uniqueRoomTypes = Array.from(new Set(rooms.map((r: any) => r.type).filter(Boolean)));

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between animate-slide-in">
        <div className="space-y-2">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient" style={{ backgroundSize: '200% auto' }}>
            Rooms
          </h2>
          <p className="text-muted-foreground text-lg">Manage your hotel rooms and their status</p>
        </div>
        <div className="animate-scale-in">
          <AddRoomDialog />
        </div>
      </div>

      <FilterBar
        searchPlaceholder="Search by room number, type, or floor..."
        onSearchChange={setSearchQuery}
        filters={[
          {
            name: "status",
            label: "Status",
            options: [
              { label: "Available", value: "available" },
              { label: "Occupied", value: "occupied" },
              { label: "Maintenance", value: "maintenance" },
            ],
            value: statusFilter,
            onChange: setStatusFilter,
          },
          {
            name: "type",
            label: "Type",
            options: uniqueRoomTypes.map((type) => ({
              label: type,
              value: type,
            })),
            value: typeFilter,
            onChange: setTypeFilter,
          },
        ]}
        priceRange={priceRange}
        onPriceRangeChange={setPriceRange}
        showPriceFilter={true}
        minPrice={0}
        maxPrice={maxRoomPrice}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredRooms.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <p className="text-muted-foreground">No rooms found. Add your first room!</p>
          </div>
        ) : (
          filteredRooms.map((room: any) => (
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
