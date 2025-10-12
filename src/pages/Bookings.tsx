import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, Bed } from "lucide-react";
import { AddBookingDialog } from "@/components/AddBookingDialog";
import { EditBookingDialog } from "@/components/EditBookingDialog";
import { FilterBar } from "@/components/FilterBar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { DateRange } from "react-day-picker";

export default function Bookings() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roomTypeFilter, setRoomTypeFilter] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [appliedFilters, setAppliedFilters] = useState({
    search: "",
    status: "all",
    roomType: "all",
    dateRange: undefined as DateRange | undefined,
  });

  const { data: bookings = [] } = useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          guests(name, email, phone),
          rooms(room_number, type)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking: any) => {
      // Search filter
      if (appliedFilters.search) {
        const searchLower = appliedFilters.search.toLowerCase();
        const matchesSearch =
          booking.guests?.name?.toLowerCase().includes(searchLower) ||
          booking.rooms?.room_number?.toLowerCase().includes(searchLower) ||
          booking.id.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Status filter
      if (appliedFilters.status !== "all" && booking.status !== appliedFilters.status) {
        return false;
      }

      // Room type filter
      if (appliedFilters.roomType !== "all" && booking.rooms?.type !== appliedFilters.roomType) {
        return false;
      }

      // Date range filter
      if (appliedFilters.dateRange?.from) {
        const checkIn = new Date(booking.check_in);
        const checkOut = new Date(booking.check_out);
        const rangeFrom = appliedFilters.dateRange.from;
        const rangeTo = appliedFilters.dateRange.to || appliedFilters.dateRange.from;

        const isInRange =
          (checkIn >= rangeFrom && checkIn <= rangeTo) ||
          (checkOut >= rangeFrom && checkOut <= rangeTo) ||
          (checkIn <= rangeFrom && checkOut >= rangeTo);

        if (!isInRange) return false;
      }

      return true;
    });
  }, [bookings, appliedFilters]);

  const handleApplyFilters = () => {
    setAppliedFilters({
      search: searchQuery,
      status: statusFilter,
      roomType: roomTypeFilter,
      dateRange: dateRange,
    });
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setRoomTypeFilter("all");
    setDateRange(undefined);
    setAppliedFilters({
      search: "",
      status: "all",
      roomType: "all",
      dateRange: undefined,
    });
  };

  const uniqueRoomTypes = Array.from(
    new Set(bookings.map((b: any) => b.rooms?.type).filter(Boolean))
  );

  return (
    <div className="space-y-8 animate-fade-in perspective-container">
      <div className="flex items-center justify-between animate-slide-in">
        <div className="space-y-2">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient" style={{ backgroundSize: '200% auto' }}>
            Bookings
          </h2>
          <p className="text-muted-foreground text-lg">Manage reservations and check-ins</p>
        </div>
        <div className="animate-scale-in">
          <AddBookingDialog />
        </div>
      </div>

      <FilterBar
        searchPlaceholder="Search by guest name, room number, or booking ID..."
        onSearchChange={setSearchQuery}
        filters={[
          {
            name: "status",
            label: "Status",
            options: [
              { label: "Confirmed", value: "confirmed" },
              { label: "Checked In", value: "checked-in" },
              { label: "Checked Out", value: "checked-out" },
              { label: "Cancelled", value: "cancelled" },
            ],
            value: statusFilter,
            onChange: setStatusFilter,
          },
          {
            name: "roomType",
            label: "Room Type",
            options: uniqueRoomTypes.map((type) => ({
              label: type,
              value: type,
            })),
            value: roomTypeFilter,
            onChange: setRoomTypeFilter,
          },
        ]}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        showDateFilter={true}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
      />

      <div className="space-y-6">
        {filteredBookings.length === 0 ? (
          <Card className="p-12 text-center animate-scale-in">
            <div className="flex flex-col items-center gap-4">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center animate-float">
                <Calendar className="h-10 w-10 text-primary" />
              </div>
              <p className="text-muted-foreground text-lg">No bookings found. Create your first booking!</p>
            </div>
          </Card>
        ) : (
          filteredBookings.map((booking: any, index: number) => (
            <Card 
              key={booking.id} 
              className="group overflow-hidden card-3d cursor-pointer"
              style={{ 
                boxShadow: "var(--shadow-elegant)",
                animationDelay: `${index * 0.1}s`,
                animationFillMode: 'both'
              }}
              onClick={() => navigate(`/bookings/${booking.id}`)}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-all duration-500" />
              
              <CardHeader className="pb-4 relative">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-2xl font-bold group-hover:text-primary transition-colors duration-300">
                      Booking #{booking.id.slice(0, 8).toUpperCase()}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm font-medium">{booking.guests?.name}</span>
                    </div>
                  </div>
                  <Badge 
                    variant={booking.status === "confirmed" ? "default" : "secondary"}
                    className="text-sm px-4 py-1.5 shadow-lg group-hover:scale-110 transition-transform duration-300"
                  >
                    {booking.status}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="relative">
                <div className="grid gap-6 md:grid-cols-4">
                  <div className="flex items-start gap-3 group/item">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 shadow-md group-hover/item:scale-110 group-hover/item:rotate-6 transition-all duration-300">
                      <Bed className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Room</p>
                      <p className="font-bold text-foreground text-lg">{booking.rooms?.type}</p>
                      <p className="text-sm text-muted-foreground">#{booking.rooms?.room_number}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 group/item">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-success/20 to-success/10 shadow-md group-hover/item:scale-110 group-hover/item:rotate-6 transition-all duration-300">
                      <Calendar className="h-6 w-6 text-success" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Check-in</p>
                      <p className="font-bold text-foreground">{new Date(booking.check_in).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 group/item">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-warning/20 to-warning/10 shadow-md group-hover/item:scale-110 group-hover/item:rotate-6 transition-all duration-300">
                      <Calendar className="h-6 w-6 text-warning" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Check-out</p>
                      <p className="font-bold text-foreground">{new Date(booking.check_out).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Total Amount</p>
                      <p className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        ${booking.total_amount || 0}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div 
                        onClick={(e) => e.stopPropagation()}
                        className="animate-fade-in"
                      >
                        <EditBookingDialog bookingId={booking.id} />
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-md hover:shadow-lg"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/bookings/${booking.id}`);
                        }}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
