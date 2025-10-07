import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone } from "lucide-react";
import { AddGuestDialog } from "@/components/AddGuestDialog";

const guests = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+1 (555) 123-4567",
    status: "checked-in",
    room: "301",
    checkOut: "2025-10-12",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    phone: "+1 (555) 234-5678",
    status: "reserved",
    room: "102",
    checkOut: "2025-10-13",
  },
  {
    id: 3,
    name: "Michael Brown",
    email: "m.brown@email.com",
    phone: "+1 (555) 345-6789",
    status: "reserved",
    room: "205",
    checkOut: "2025-10-15",
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily.d@email.com",
    phone: "+1 (555) 456-7890",
    status: "checked-in",
    room: "402",
    checkOut: "2025-10-20",
  },
];

export default function Guests() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Guests</h2>
          <p className="text-muted-foreground">View and manage guest information</p>
        </div>
        <AddGuestDialog />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {guests.map((guest) => (
          <Card key={guest.id} className="p-6 transition-all hover:shadow-lg" style={{ boxShadow: "var(--shadow-elegant)" }}>
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-lg font-semibold text-primary-foreground">
                  {guest.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg text-foreground">{guest.name}</h3>
                    <p className="text-sm text-muted-foreground">Room {guest.room}</p>
                  </div>
                  <Badge variant={guest.status === "checked-in" ? "default" : "secondary"}>
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
                <div className="flex items-center justify-between pt-2 border-t">
                  <div>
                    <p className="text-xs text-muted-foreground">Check-out</p>
                    <p className="text-sm font-medium text-foreground">{guest.checkOut}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    View Profile
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
