import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Shield } from "lucide-react";

type Role = 'admin' | 'manager' | 'receptionist' | 'housekeeping' | 'staff' | 'guest';

export function RoleGuard({ allow, children }: { allow: Role[]; children: React.ReactNode }) {
  const { role, loading, user } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="h-8 w-8 rounded-full bg-primary animate-pulse mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle className="text-2xl">Authentication Required</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              You need to be logged in to access this page.
            </p>
            <p className="text-sm text-muted-foreground">
              Please sign in to continue.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (!role || !allow.includes(role)) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="h-16 w-16 rounded-full bg-warning/10 flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-warning" />
            </div>
            <CardTitle className="text-2xl">Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              You don't have permission to access this page.
            </p>
            <div className="space-y-2">
              <p className="text-sm font-medium">Required roles:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {allow.map((role) => (
                  <span key={role} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                    {role}
                  </span>
                ))}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Your current role: <span className="font-medium">{role || 'None'}</span>
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return <>{children}</>;
}