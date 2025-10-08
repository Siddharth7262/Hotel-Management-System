-- Create rooms table
CREATE TABLE public.rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_number TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'available',
  floor INTEGER NOT NULL,
  capacity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create guests table
CREATE TABLE public.guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id UUID NOT NULL REFERENCES public.guests(id) ON DELETE CASCADE,
  room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'confirmed',
  total_amount DECIMAL(10, 2),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust based on your auth needs)
CREATE POLICY "Allow public read access to rooms"
  ON public.rooms FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert to rooms"
  ON public.rooms FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update to rooms"
  ON public.rooms FOR UPDATE
  USING (true);

CREATE POLICY "Allow public delete from rooms"
  ON public.rooms FOR DELETE
  USING (true);

CREATE POLICY "Allow public read access to guests"
  ON public.guests FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert to guests"
  ON public.guests FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update to guests"
  ON public.guests FOR UPDATE
  USING (true);

CREATE POLICY "Allow public delete from guests"
  ON public.guests FOR DELETE
  USING (true);

CREATE POLICY "Allow public read access to bookings"
  ON public.bookings FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert to bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update to bookings"
  ON public.bookings FOR UPDATE
  USING (true);

CREATE POLICY "Allow public delete from bookings"
  ON public.bookings FOR DELETE
  USING (true);

-- Create indexes for better performance
CREATE INDEX idx_bookings_guest_id ON public.bookings(guest_id);
CREATE INDEX idx_bookings_room_id ON public.bookings(room_id);
CREATE INDEX idx_bookings_dates ON public.bookings(check_in, check_out);
CREATE INDEX idx_rooms_status ON public.rooms(status);

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for automatic timestamp updates
CREATE TRIGGER update_rooms_updated_at
  BEFORE UPDATE ON public.rooms
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_guests_updated_at
  BEFORE UPDATE ON public.guests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();