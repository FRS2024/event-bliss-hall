
-- Create venues table
CREATE TABLE public.venues (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  host_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  capacity INTEGER NOT NULL,
  price_per_hour DECIMAL(10,2),
  price_per_day DECIMAL(10,2),
  price_per_event DECIMAL(10,2),
  city TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN DEFAULT true
);

-- Create venue images table
CREATE TABLE public.venue_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  venue_id UUID REFERENCES public.venues ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create venue features table
CREATE TABLE public.venue_features (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  venue_id UUID REFERENCES public.venues ON DELETE CASCADE NOT NULL,
  feature_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create venue availability table
CREATE TABLE public.venue_availability (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  venue_id UUID REFERENCES public.venues ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  is_available BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(venue_id, date)
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  venue_id UUID REFERENCES public.venues ON DELETE CASCADE NOT NULL,
  guest_id UUID REFERENCES auth.users NOT NULL,
  host_id UUID REFERENCES auth.users NOT NULL,
  event_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  guest_count INTEGER NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  special_requests TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venue_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venue_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venue_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for venues
CREATE POLICY "Hosts can view their own venues" ON public.venues FOR SELECT USING (auth.uid() = host_id);
CREATE POLICY "Hosts can create venues" ON public.venues FOR INSERT WITH CHECK (auth.uid() = host_id);
CREATE POLICY "Hosts can update their own venues" ON public.venues FOR UPDATE USING (auth.uid() = host_id);
CREATE POLICY "Hosts can delete their own venues" ON public.venues FOR DELETE USING (auth.uid() = host_id);
CREATE POLICY "Public can view active venues" ON public.venues FOR SELECT USING (is_active = true);

-- RLS Policies for venue images
CREATE POLICY "Hosts can manage their venue images" ON public.venue_images FOR ALL USING (
  EXISTS (SELECT 1 FROM public.venues WHERE venues.id = venue_images.venue_id AND venues.host_id = auth.uid())
);
CREATE POLICY "Public can view venue images" ON public.venue_images FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.venues WHERE venues.id = venue_images.venue_id AND venues.is_active = true)
);

-- RLS Policies for venue features
CREATE POLICY "Hosts can manage their venue features" ON public.venue_features FOR ALL USING (
  EXISTS (SELECT 1 FROM public.venues WHERE venues.id = venue_features.venue_id AND venues.host_id = auth.uid())
);
CREATE POLICY "Public can view venue features" ON public.venue_features FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.venues WHERE venues.id = venue_features.venue_id AND venues.is_active = true)
);

-- RLS Policies for venue availability
CREATE POLICY "Hosts can manage their venue availability" ON public.venue_availability FOR ALL USING (
  EXISTS (SELECT 1 FROM public.venues WHERE venues.id = venue_availability.venue_id AND venues.host_id = auth.uid())
);
CREATE POLICY "Public can view venue availability" ON public.venue_availability FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.venues WHERE venues.id = venue_availability.venue_id AND venues.is_active = true)
);

-- RLS Policies for bookings
CREATE POLICY "Hosts can view bookings for their venues" ON public.bookings FOR SELECT USING (auth.uid() = host_id);
CREATE POLICY "Guests can view their own bookings" ON public.bookings FOR SELECT USING (auth.uid() = guest_id);
CREATE POLICY "Guests can create bookings" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = guest_id);
CREATE POLICY "Hosts can update booking status" ON public.bookings FOR UPDATE USING (auth.uid() = host_id);
CREATE POLICY "Guests can update their bookings" ON public.bookings FOR UPDATE USING (auth.uid() = guest_id AND status = 'pending');

-- Create storage bucket for venue images
INSERT INTO storage.buckets (id, name, public) VALUES ('venue-images', 'venue-images', true);

-- Storage policies for venue images
CREATE POLICY "Authenticated users can upload venue images" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'venue-images' AND auth.role() = 'authenticated'
);

CREATE POLICY "Public can view venue images" ON storage.objects FOR SELECT USING (
  bucket_id = 'venue-images'
);

CREATE POLICY "Users can update their venue images" ON storage.objects FOR UPDATE USING (
  bucket_id = 'venue-images' AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their venue images" ON storage.objects FOR DELETE USING (
  bucket_id = 'venue-images' AND auth.uid()::text = (storage.foldername(name))[1]
);
