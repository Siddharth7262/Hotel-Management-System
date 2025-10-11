import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, DollarSign, Settings as SettingsIcon } from "lucide-react";

export default function Settings() {
  return (
    <div className="min-h-screen space-y-8 perspective-container relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-primary/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "0s" }} />
        <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-accent/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 h-1/3 bg-secondary/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "3s" }} />
      </div>

      <div className="animate-fade-in">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500 animate-pulse" />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-2xl animate-float">
              <SettingsIcon className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient mb-1">
              Settings
            </h1>
            <p className="text-muted-foreground text-lg font-medium">Manage your hotel configuration with ease</p>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2" style={{ perspective: "1200px" }}>
        <Card className="group card-3d animate-slide-up backdrop-blur-xl border-2 border-primary/10 hover:border-primary/30 relative overflow-hidden" style={{ animationDelay: "0.1s", boxShadow: "var(--shadow-elegant)" }}>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-accent/3 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700" />
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <CardHeader className="relative overflow-hidden pb-4">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
                <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
                  <Building2 className="h-6 w-6 text-primary-foreground" />
                </div>
              </div>
              <div>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">Hotel Information</CardTitle>
                <CardDescription className="text-base">Update your hotel's basic information</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 relative">
            <div className="space-y-3 input-group">
              <Label htmlFor="hotelName" className="text-sm font-bold text-foreground flex items-center gap-2">
                Hotel Name
                <span className="text-xs font-normal text-muted-foreground">(Required)</span>
              </Label>
              <Input 
                id="hotelName" 
                placeholder="Enter hotel name" 
                defaultValue="Grand Hotel"
                className="transition-all duration-300 hover:border-primary/50 focus:scale-[1.01] shadow-sm hover:shadow-md"
              />
            </div>
            <div className="space-y-3 input-group">
              <Label htmlFor="address" className="text-sm font-bold text-foreground flex items-center gap-2">
                Address
                <span className="text-xs font-normal text-muted-foreground">(Required)</span>
              </Label>
              <Input 
                id="address" 
                placeholder="Enter hotel address" 
                defaultValue="123 Main St, City"
                className="transition-all duration-300 hover:border-primary/50 focus:scale-[1.01] shadow-sm hover:shadow-md"
              />
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-3 input-group">
                <Label htmlFor="phone" className="text-sm font-bold text-foreground">Phone</Label>
                <Input 
                  id="phone" 
                  placeholder="+1 (555) 000-0000" 
                  defaultValue="+1 (555) 000-0000"
                  className="transition-all duration-300 hover:border-primary/50 focus:scale-[1.01] shadow-sm hover:shadow-md"
                />
              </div>
              <div className="space-y-3 input-group">
                <Label htmlFor="email" className="text-sm font-bold text-foreground">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="info@hotel.com" 
                  defaultValue="info@hotel.com"
                  className="transition-all duration-300 hover:border-primary/50 focus:scale-[1.01] shadow-sm hover:shadow-md"
                />
              </div>
            </div>
            <Button className="w-full md:w-auto bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 font-semibold">
              Save Changes
            </Button>
          </CardContent>
        </Card>

        <Card className="group card-3d animate-slide-up backdrop-blur-xl border-2 border-secondary/10 hover:border-secondary/30 relative overflow-hidden" style={{ animationDelay: "0.2s", boxShadow: "var(--shadow-elegant)" }}>
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/3 via-accent/3 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700" />
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-secondary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <CardHeader className="relative overflow-hidden pb-4">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-secondary to-accent rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
                <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-secondary to-accent shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
                  <DollarSign className="h-6 w-6 text-secondary-foreground" />
                </div>
              </div>
              <div>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">Pricing Configuration</CardTitle>
                <CardDescription className="text-base">Set default pricing for room types</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 relative">
            <div className="grid gap-5 md:grid-cols-1">
              <div className="space-y-3 input-group group/input">
                <Label htmlFor="standard" className="text-sm font-bold text-foreground flex items-center justify-between">
                  <span>Standard Room</span>
                  <span className="text-xs font-normal text-muted-foreground">Per night</span>
                </Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-base">$</span>
                  <Input 
                    id="standard" 
                    type="number" 
                    placeholder="120" 
                    defaultValue="120"
                    className="pl-8 transition-all duration-300 hover:border-primary/50 focus:scale-[1.01] shadow-sm hover:shadow-md font-semibold text-base"
                  />
                </div>
              </div>
              <div className="space-y-3 input-group group/input">
                <Label htmlFor="deluxe" className="text-sm font-bold text-foreground flex items-center justify-between">
                  <span>Deluxe Room</span>
                  <span className="text-xs font-normal text-muted-foreground">Per night</span>
                </Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-base">$</span>
                  <Input 
                    id="deluxe" 
                    type="number" 
                    placeholder="180" 
                    defaultValue="180"
                    className="pl-8 transition-all duration-300 hover:border-primary/50 focus:scale-[1.01] shadow-sm hover:shadow-md font-semibold text-base"
                  />
                </div>
              </div>
              <div className="space-y-3 input-group group/input">
                <Label htmlFor="suite" className="text-sm font-bold text-foreground flex items-center justify-between">
                  <span>Executive Suite</span>
                  <span className="text-xs font-normal text-muted-foreground">Per night</span>
                </Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-base">$</span>
                  <Input 
                    id="suite" 
                    type="number" 
                    placeholder="350" 
                    defaultValue="350"
                    className="pl-8 transition-all duration-300 hover:border-primary/50 focus:scale-[1.01] shadow-sm hover:shadow-md font-semibold text-base"
                  />
                </div>
              </div>
            </div>
            <Button className="w-full md:w-auto bg-gradient-to-r from-secondary to-accent hover:from-secondary/90 hover:to-accent/90 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 font-semibold">
              Update Pricing
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
