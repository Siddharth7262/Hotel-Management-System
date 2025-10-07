import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Settings() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Settings</h2>
        <p className="text-muted-foreground">Manage your hotel configuration</p>
      </div>

      <div className="space-y-6">
        <Card style={{ boxShadow: "var(--shadow-elegant)" }}>
          <CardHeader>
            <CardTitle>Hotel Information</CardTitle>
            <CardDescription>Update your hotel's basic information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="hotelName">Hotel Name</Label>
              <Input id="hotelName" placeholder="Grand Hotel" defaultValue="Grand Hotel" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" placeholder="123 Main St, City" defaultValue="123 Main St, City" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" placeholder="+1 (555) 000-0000" defaultValue="+1 (555) 000-0000" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="info@hotel.com" defaultValue="info@hotel.com" />
              </div>
            </div>
            <Button className="bg-gradient-to-r from-primary to-accent">Save Changes</Button>
          </CardContent>
        </Card>

        <Card style={{ boxShadow: "var(--shadow-elegant)" }}>
          <CardHeader>
            <CardTitle>Pricing Configuration</CardTitle>
            <CardDescription>Set default pricing for room types</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="standard">Standard Room</Label>
                <Input id="standard" type="number" placeholder="120" defaultValue="120" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deluxe">Deluxe Room</Label>
                <Input id="deluxe" type="number" placeholder="180" defaultValue="180" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="suite">Executive Suite</Label>
                <Input id="suite" type="number" placeholder="350" defaultValue="350" />
              </div>
            </div>
            <Button className="bg-gradient-to-r from-primary to-accent">Update Pricing</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
