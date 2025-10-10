import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, DollarSign, Settings as SettingsIcon } from "lucide-react";

export default function Settings() {
  return (
    <div className="min-h-screen space-y-8 perspective-container">
      <div className="animate-fade-in">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg animate-float" style={{ boxShadow: "var(--shadow-elegant)" }}>
            <SettingsIcon className="h-7 w-7 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient">
              Settings
            </h1>
            <p className="text-muted-foreground text-lg">Manage your hotel configuration</p>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2" style={{ perspective: "1000px" }}>
        <Card className="group card-3d animate-slide-up backdrop-blur-sm border-2" style={{ animationDelay: "0.1s" }}>
          <CardHeader className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                <Building2 className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-2xl">Hotel Information</CardTitle>
                <CardDescription>Update your hotel's basic information</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2 input-group">
              <Label htmlFor="hotelName" className="text-sm font-semibold text-foreground/90">Hotel Name</Label>
              <Input 
                id="hotelName" 
                placeholder="Enter hotel name" 
                defaultValue="Grand Hotel"
                className="transition-all duration-300 hover:border-primary/50 focus:scale-[1.01]"
              />
            </div>
            <div className="space-y-2 input-group">
              <Label htmlFor="address" className="text-sm font-semibold text-foreground/90">Address</Label>
              <Input 
                id="address" 
                placeholder="Enter hotel address" 
                defaultValue="123 Main St, City"
                className="transition-all duration-300 hover:border-primary/50 focus:scale-[1.01]"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 input-group">
                <Label htmlFor="phone" className="text-sm font-semibold text-foreground/90">Phone</Label>
                <Input 
                  id="phone" 
                  placeholder="+1 (555) 000-0000" 
                  defaultValue="+1 (555) 000-0000"
                  className="transition-all duration-300 hover:border-primary/50 focus:scale-[1.01]"
                />
              </div>
              <div className="space-y-2 input-group">
                <Label htmlFor="email" className="text-sm font-semibold text-foreground/90">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="info@hotel.com" 
                  defaultValue="info@hotel.com"
                  className="transition-all duration-300 hover:border-primary/50 focus:scale-[1.01]"
                />
              </div>
            </div>
            <Button className="w-full md:w-auto shadow-lg hover:shadow-xl transition-all duration-300">
              Save Changes
            </Button>
          </CardContent>
        </Card>

        <Card className="group card-3d animate-slide-up backdrop-blur-sm border-2" style={{ animationDelay: "0.2s" }}>
          <CardHeader className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-secondary to-accent shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                <DollarSign className="h-5 w-5 text-secondary-foreground" />
              </div>
              <div>
                <CardTitle className="text-2xl">Pricing Configuration</CardTitle>
                <CardDescription>Set default pricing for room types</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-1">
              <div className="space-y-2 input-group">
                <Label htmlFor="standard" className="text-sm font-semibold text-foreground/90">Standard Room</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">$</span>
                  <Input 
                    id="standard" 
                    type="number" 
                    placeholder="120" 
                    defaultValue="120"
                    className="pl-7 transition-all duration-300 hover:border-primary/50 focus:scale-[1.01]"
                  />
                </div>
              </div>
              <div className="space-y-2 input-group">
                <Label htmlFor="deluxe" className="text-sm font-semibold text-foreground/90">Deluxe Room</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">$</span>
                  <Input 
                    id="deluxe" 
                    type="number" 
                    placeholder="180" 
                    defaultValue="180"
                    className="pl-7 transition-all duration-300 hover:border-primary/50 focus:scale-[1.01]"
                  />
                </div>
              </div>
              <div className="space-y-2 input-group">
                <Label htmlFor="suite" className="text-sm font-semibold text-foreground/90">Executive Suite</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">$</span>
                  <Input 
                    id="suite" 
                    type="number" 
                    placeholder="350" 
                    defaultValue="350"
                    className="pl-7 transition-all duration-300 hover:border-primary/50 focus:scale-[1.01]"
                  />
                </div>
              </div>
            </div>
            <Button className="w-full md:w-auto shadow-lg hover:shadow-xl transition-all duration-300">
              Update Pricing
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
