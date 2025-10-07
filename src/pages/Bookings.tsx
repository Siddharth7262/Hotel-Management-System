import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, Bed } from "lucide-react";

const bookings = [
  {
    id: "BK001",
    guest: "John Smith",
    room: "Deluxe Suite 301",
    checkIn: "2025-10-08",
    checkOut: "2025-10-12",
    status: "confirmed",
    total: 1400,
  },
  {
    id: "BK002",
    guest: "Sarah Johnson",
    room: "Standard Room 102",
    checkIn: "2025-10-10",
    checkOut: "2025-10-13",
    status: "confirmed",
    total: 360,
  },
  {
    id: "BK003",
    guest: "Michael Brown",
    room: "Executive Room 205",
    checkIn: "2025-10-12",
    checkOut: "2025-10-15",
    status: "pending",
    total: 540,
  },
  {
    id: "BK004",
    guest: "Emily Davis",
    room: "Deluxe Suite 402",
    checkIn: "2025-10-15",
    checkOut: "2025-10-20",
    status: "confirmed",
    total: 1750,
  },
  {
    id: "BK005",
    guest: "David Wilson",
    room: "Standard Room 105",
    checkIn: "2025-10-18",
    checkOut: "2025-10-21",
    status: "pending",
    total: 360,
  },
];

export default function Bookings() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Bookings</h2>
          <p className="text-muted-foreground">Manage reservations and check-ins</p>
        </div>
        <Button className="bg-gradient-to-r from-primary to-accent">New Booking</Button>
      </div>

      <div className="space-y-4">
        {bookings.map((booking) => (
          <Card key={booking.id} className="overflow-hidden transition-all hover:shadow-lg" style={{ boxShadow: "var(--shadow-elegant)" }}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-xl">Booking {booking.id}</CardTitle>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span className="text-sm">{booking.guest}</span>
                  </div>
                </div>
                <Badge variant={booking.status === "confirmed" ? "default" : "secondary"}>
                  {booking.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Bed className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Room</p>
                    <p className="font-medium text-foreground">{booking.room}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                    <Calendar className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Check-in</p>
                    <p className="font-medium text-foreground">{booking.checkIn}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                    <Calendar className="h-5 w-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Check-out</p>
                    <p className="font-medium text-foreground">{booking.checkOut}</p>
                  </div>
                </div>
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="text-xl font-bold text-primary">${booking.total}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
