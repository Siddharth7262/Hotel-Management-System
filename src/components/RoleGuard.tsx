import { useAuth } from "@/contexts/AuthContext";

type Role = 'admin' | 'manager' | 'receptionist' | 'housekeeping' | 'staff' | 'guest';

export function RoleGuard({ allow, children }: { allow: Role[]; children: React.ReactNode }) {
  const { role, loading } = useAuth();
  if (loading) return null;
  if (!role) return null;
  if (!allow.includes(role)) return null;
  return <>{children}</>;
}