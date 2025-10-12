import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone } from "lucide-react";
import { AddGuestDialog } from "@/components/AddGuestDialog";
import { FilterBar } from "@/components/FilterBar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";

export default function Guests() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [appliedFilters, setAppliedFilters] = useState({
    search: "",
    status: "all",
  });

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

  const filteredGuests = useMemo(() => {
    return guests.filter((guest: any) => {
      // Search filter
      if (appliedFilters.search) {
        const searchLower = appliedFilters.search.toLowerCase();
        const matchesSearch =
          guest.name?.toLowerCase().includes(searchLower) ||
          guest.email?.toLowerCase().includes(searchLower) ||
          guest.phone?.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Status filter
      if (appliedFilters.status !== "all" && guest.status !== appliedFilters.status) {
        return false;
      }

      return true;
    });
  }, [guests, appliedFilters]);

  const handleApplyFilters = () => {
    setAppliedFilters({
      search: searchQuery,
      status: statusFilter,
    });
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setAppliedFilters({
      search: "",
      status: "all",
    });
  };

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

      <FilterBar
        searchPlaceholder="Search by name, email, or phone..."
        onSearchChange={setSearchQuery}
        filters={[
          {
            name: "status",
            label: "Status",
            options: [
              { label: "Active", value: "active" },
              { label: "Inactive", value: "inactive" },
            ],
            value: statusFilter,
            onChange: setStatusFilter,
          },
        ]}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
      />

      <div className="grid gap-6 md:grid-cols-2">
        {filteredGuests.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <p className="text-muted-foreground">No guests found. Add your first guest!</p>
          </div>
        ) : (
          filteredGuests.map((guest: any) => (
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
                    <Button variant="outline" size="sm" onClick={() => navigate(`/guests/${guest.id}`)}>
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
