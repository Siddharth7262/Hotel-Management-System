import { Card } from "@/components/ui/card";
import { Building2, Users, Shield, Clock, Star, TrendingUp } from "lucide-react";

export function AboutSection() {
  const features = [
    {
      icon: Building2,
      title: "Modern Management",
      description: "State-of-the-art hotel management system designed for efficiency and ease of use.",
      gradient: "from-blue-500/20 to-cyan-500/20",
      iconColor: "text-blue-500",
    },
    {
      icon: Users,
      title: "Guest Experience",
      description: "Comprehensive guest management with detailed profiles and booking history tracking.",
      gradient: "from-purple-500/20 to-pink-500/20",
      iconColor: "text-purple-500",
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Enterprise-grade security with encrypted data storage and reliable backup systems.",
      gradient: "from-green-500/20 to-emerald-500/20",
      iconColor: "text-green-500",
    },
    {
      icon: Clock,
      title: "Real-time Updates",
      description: "Instant synchronization across all devices with live booking and availability status.",
      gradient: "from-orange-500/20 to-amber-500/20",
      iconColor: "text-orange-500",
    },
    {
      icon: Star,
      title: "Premium Service",
      description: "Deliver exceptional service with tools designed to exceed guest expectations.",
      gradient: "from-yellow-500/20 to-orange-500/20",
      iconColor: "text-yellow-500",
    },
    {
      icon: TrendingUp,
      title: "Analytics & Insights",
      description: "Powerful analytics dashboard to track performance and optimize operations.",
      gradient: "from-red-500/20 to-rose-500/20",
      iconColor: "text-red-500",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-4 animate-slide-in">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">About HotelHub</span>
        </div>
        <h2 className="text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient" 
            style={{ backgroundSize: '200% auto' }}>
          Your Complete Hotel Management Solution
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          HotelHub is a comprehensive hotel management platform designed to streamline operations, 
          enhance guest experiences, and drive business growth through innovative technology and intuitive design.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <Card
            key={feature.title}
            className="group relative overflow-hidden border-2 border-border/50 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:scale-105 animate-scale-in"
            style={{ 
              animationDelay: `${index * 100}ms`,
              boxShadow: "var(--shadow-elegant)"
            }}
          >
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            
            {/* Content */}
            <div className="relative p-6 space-y-4">
              {/* Icon */}
              <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-background to-background/80 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                <feature.icon className={`h-8 w-8 ${feature.iconColor}`} />
              </div>

              {/* Text Content */}
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Hover Effect Line */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </div>
          </Card>
        ))}
      </div>

      {/* Stats Section */}
      <Card className="mt-8 overflow-hidden border-2 border-primary/20 animate-scale-in" 
            style={{ 
              boxShadow: "var(--shadow-elegant)",
              animationDelay: "600ms"
            }}>
        <div className="relative p-8 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5">
          <div className="grid gap-8 md:grid-cols-4 text-center">
            <div className="space-y-2 group">
              <p className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                10K+
              </p>
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Bookings Managed
              </p>
            </div>
            <div className="space-y-2 group">
              <p className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                99.9%
              </p>
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Uptime Reliability
              </p>
            </div>
            <div className="space-y-2 group">
              <p className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                24/7
              </p>
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                System Availability
              </p>
            </div>
            <div className="space-y-2 group">
              <p className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                500+
              </p>
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Hotels Connected
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
