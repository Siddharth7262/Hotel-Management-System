-- Create profiles table for user management
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'staff',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    COALESCE(new.raw_user_meta_data->>'role', 'staff')
  );
  RETURN new;
END;
$$;

-- Trigger for auto-creating profiles
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update RLS policies for rooms to require authentication
DROP POLICY IF EXISTS "Allow public read access to rooms" ON public.rooms;
DROP POLICY IF EXISTS "Allow public insert to rooms" ON public.rooms;
DROP POLICY IF EXISTS "Allow public update to rooms" ON public.rooms;
DROP POLICY IF EXISTS "Allow public delete from rooms" ON public.rooms;

CREATE POLICY "Authenticated users can view rooms"
  ON public.rooms FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert rooms"
  ON public.rooms FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update rooms"
  ON public.rooms FOR UPDATE
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete rooms"
  ON public.rooms FOR DELETE
  USING (auth.uid() IS NOT NULL);

-- Update RLS policies for guests to require authentication
DROP POLICY IF EXISTS "Allow public read access to guests" ON public.guests;
DROP POLICY IF EXISTS "Allow public insert to guests" ON public.guests;
DROP POLICY IF EXISTS "Allow public update to guests" ON public.guests;
DROP POLICY IF EXISTS "Allow public delete from guests" ON public.guests;

CREATE POLICY "Authenticated users can view guests"
  ON public.guests FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert guests"
  ON public.guests FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update guests"
  ON public.guests FOR UPDATE
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete guests"
  ON public.guests FOR DELETE
  USING (auth.uid() IS NOT NULL);

-- Update RLS policies for bookings to require authentication
DROP POLICY IF EXISTS "Allow public read access to bookings" ON public.bookings;
DROP POLICY IF EXISTS "Allow public insert to bookings" ON public.bookings;
DROP POLICY IF EXISTS "Allow public update to bookings" ON public.bookings;
DROP POLICY IF EXISTS "Allow public delete from bookings" ON public.bookings;

CREATE POLICY "Authenticated users can view bookings"
  ON public.bookings FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update bookings"
  ON public.bookings FOR UPDATE
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete bookings"
  ON public.bookings FOR DELETE
  USING (auth.uid() IS NOT NULL);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_rooms_status ON public.rooms(status);
CREATE INDEX IF NOT EXISTS idx_rooms_type ON public.rooms(type);
CREATE INDEX IF NOT EXISTS idx_guests_status ON public.guests(status);
CREATE INDEX IF NOT EXISTS idx_guests_email ON public.guests(email);
CREATE INDEX IF NOT EXISTS idx_bookings_check_in ON public.bookings(check_in);
CREATE INDEX IF NOT EXISTS idx_bookings_check_out ON public.bookings(check_out);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_guest_id ON public.bookings(guest_id);
CREATE INDEX IF NOT EXISTS idx_bookings_room_id ON public.bookings(room_id);

-- Add trigger for profiles updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();