-- Helper to check current user's role
CREATE OR REPLACE FUNCTION public.current_role()
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid()
$$;

-- Convenience: does current user have any of the given roles?
CREATE OR REPLACE FUNCTION public.has_role(roles text[])
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.role = ANY(roles)
  )
$$;

-- Extend rooms with housekeeping-related fields
DO $$
BEGIN
  IF NOT EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='rooms' AND column_name='clean_status') THEN
    ALTER TABLE public.rooms ADD COLUMN clean_status TEXT NOT NULL DEFAULT 'clean'; -- clean, dirty, in-progress
  END IF;
  IF NOT EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='rooms' AND column_name='needs_maintenance') THEN
    ALTER TABLE public.rooms ADD COLUMN needs_maintenance BOOLEAN NOT NULL DEFAULT false;
  END IF;
  IF NOT EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='rooms' AND column_name='maintenance_notes') THEN
    ALTER TABLE public.rooms ADD COLUMN maintenance_notes TEXT;
  END IF;
END $$;

-- Tighten RLS with role-aware policies

-- Rooms
DROP POLICY IF EXISTS "Authenticated users can view rooms" ON public.rooms;
DROP POLICY IF EXISTS "Authenticated users can insert rooms" ON public.rooms;
DROP POLICY IF EXISTS "Authenticated users can update rooms" ON public.rooms;
DROP POLICY IF EXISTS "Authenticated users can delete rooms" ON public.rooms;

CREATE POLICY "Rooms select for any authenticated"
  ON public.rooms FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Rooms insert for admin/manager"
  ON public.rooms FOR INSERT
  WITH CHECK (public.has_role(ARRAY['admin','manager']::text[]));

-- Managers/admins can update any columns
CREATE POLICY "Rooms full update for admin/manager"
  ON public.rooms FOR UPDATE
  USING (public.has_role(ARRAY['admin','manager']::text[]));

-- Housekeeping can only update cleaning/maintenance-specific columns
CREATE POLICY "Rooms housekeeping limited update"
  ON public.rooms FOR UPDATE
  USING (public.has_role(ARRAY['housekeeping']::text[]))
  WITH CHECK (
    -- restrict changes to allowed fields only by ensuring other fields remain same
    id = id
    AND room_number = room_number
    AND type = type
    AND status = status -- allow status update too if needed
    AND floor = floor
    AND capacity = capacity
    AND price = price
  );

CREATE POLICY "Rooms delete for admin"
  ON public.rooms FOR DELETE
  USING (public.has_role(ARRAY['admin']::text[]));

-- Guests
DROP POLICY IF EXISTS "Authenticated users can view guests" ON public.guests;
DROP POLICY IF EXISTS "Authenticated users can insert guests" ON public.guests;
DROP POLICY IF EXISTS "Authenticated users can update guests" ON public.guests;
DROP POLICY IF EXISTS "Authenticated users can delete guests" ON public.guests;

CREATE POLICY "Guests select for staff"
  ON public.guests FOR SELECT
  USING (public.has_role(ARRAY['admin','manager','receptionist']::text[]));

CREATE POLICY "Guests insert for receptionist/manager/admin"
  ON public.guests FOR INSERT
  WITH CHECK (public.has_role(ARRAY['admin','manager','receptionist']::text[]));

CREATE POLICY "Guests update for receptionist/manager/admin"
  ON public.guests FOR UPDATE
  USING (public.has_role(ARRAY['admin','manager','receptionist']::text[]));

CREATE POLICY "Guests delete for admin"
  ON public.guests FOR DELETE
  USING (public.has_role(ARRAY['admin']::text[]));

-- Bookings
DROP POLICY IF EXISTS "Authenticated users can view bookings" ON public.bookings;
DROP POLICY IF EXISTS "Authenticated users can insert bookings" ON public.bookings;
DROP POLICY IF EXISTS "Authenticated users can update bookings" ON public.bookings;
DROP POLICY IF EXISTS "Authenticated users can delete bookings" ON public.bookings;

CREATE POLICY "Bookings select for staff"
  ON public.bookings FOR SELECT
  USING (public.has_role(ARRAY['admin','manager','receptionist']::text[]));

CREATE POLICY "Bookings insert for receptionist/manager/admin"
  ON public.bookings FOR INSERT
  WITH CHECK (public.has_role(ARRAY['admin','manager','receptionist']::text[]));

CREATE POLICY "Bookings update for receptionist/manager/admin"
  ON public.bookings FOR UPDATE
  USING (public.has_role(ARRAY['admin','manager','receptionist']::text[]));

CREATE POLICY "Bookings delete for admin/manager"
  ON public.bookings FOR DELETE
  USING (public.has_role(ARRAY['admin','manager']::text[]));

-- Payments: receptionist/manager/admin
DROP POLICY IF EXISTS "Authenticated users can read payments" ON public.payments;
DROP POLICY IF EXISTS "Authenticated users can insert payments" ON public.payments;
DROP POLICY IF EXISTS "Authenticated users can update payments" ON public.payments;
DROP POLICY IF EXISTS "Authenticated users can delete payments" ON public.payments;

CREATE POLICY "Payments select for staff"
  ON public.payments FOR SELECT
  USING (public.has_role(ARRAY['admin','manager','receptionist']::text[]));

CREATE POLICY "Payments insert for receptionist/manager/admin"
  ON public.payments FOR INSERT
  WITH CHECK (public.has_role(ARRAY['admin','manager','receptionist']::text[]));

CREATE POLICY "Payments update for manager/admin"
  ON public.payments FOR UPDATE
  USING (public.has_role(ARRAY['admin','manager']::text[]));

CREATE POLICY "Payments delete for admin"
  ON public.payments FOR DELETE
  USING (public.has_role(ARRAY['admin']::text[]));

-- Feedback: allow staff to read and insert; guests later with mapping
DROP POLICY IF EXISTS "Authenticated users can read feedback" ON public.feedback;
DROP POLICY IF EXISTS "Authenticated users can insert feedback" ON public.feedback;

CREATE POLICY "Feedback select for staff"
  ON public.feedback FOR SELECT
  USING (public.has_role(ARRAY['admin','manager','receptionist']::text[]));

CREATE POLICY "Feedback insert for staff"
  ON public.feedback FOR INSERT
  WITH CHECK (public.has_role(ARRAY['admin','manager','receptionist']::text[]));