import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AddRoomDialog } from "@/components/AddRoomDialog";
import { FilterBar } from "@/components/FilterBar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
<<<<<<< HEAD
import { Bed } from "lucide-react";
=======
import { useState, useMemo } from "react";
>>>>>>> 2e7e48cff2357045d7214743a12f692a84ebcc2d

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
<<<<<<< HEAD
        {rooms.length === 0 ? (
          <Card className="col-span-full p-12 text-center animate-scale-in">
            <div className="flex flex-col items-center gap-4">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center animate-float">
                <Bed className="h-10 w-10 text-primary" />
              </div>
              <p className="text-muted-foreground text-lg">No rooms found. Add your first room!</p>
            </div>
          </Card>
        ) : (
          rooms.map((room: any, index: number) => (
            <Card 
              key={room.id} 
              className="group overflow-hidden card-3d cursor-pointer"
              style={{ 
                boxShadow: "var(--shadow-elegant)",
                animationDelay: `${index * 0.1}s`,
                animationFillMode: 'both'
              }}
              onClick={() => navigate(`/rooms/${room.id}`)}
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-all duration-500" />
              
              <CardHeader className="pb-4 relative">
=======
        {filteredRooms.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <p className="text-muted-foreground">No rooms found. Add your first room!</p>
          </div>
        ) : (
          filteredRooms.map((room: any) => (
            <Card key={room.id} className="overflow-hidden transition-all hover:shadow-lg" style={{ boxShadow: "var(--shadow-elegant)" }}>
              <CardHeader className="pb-3">
>>>>>>> 2e7e48cff2357045d7214743a12f692a84ebcc2d
                <div className="flex items-start justify-between">
                  <CardTitle className="text-2xl font-bold group-hover:text-primary transition-colors duration-300">
                    Room {room.room_number}
                  </CardTitle>
                  <Badge className={`${getStatusColor(room.status)} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {room.status}
                  </Badge>
                </div>
                <div className="mt-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-primary/10 to-accent/10">
                    <Bed className="h-4 w-4 text-primary" />
                    <span className="text-sm font-semibold text-foreground">{room.type}</span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4 relative">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-success/10 to-success/5 border border-success/20 group-hover:scale-105 transition-transform duration-300">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Floor</p>
                    <p className="text-xl font-bold text-foreground">{room.floor}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 group-hover:scale-105 transition-transform duration-300">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Capacity</p>
                    <p className="text-xl font-bold text-foreground">{room.capacity}</p>
                  </div>
                </div>
                
                <div className="p-4 rounded-xl bg-gradient-to-br from-accent/10 via-primary/10 to-accent/10 border border-accent/20">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-2">Price per night</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    ${room.price}
                  </p>
                </div>
                
                <Button 
                  className="w-full mt-4 bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-md hover:shadow-lg transition-all duration-300 group-hover:scale-[1.02]" 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/rooms/${room.id}`);
                  }}
                >
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
