-- Add verification fields to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_verified boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS verified_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS verified_by uuid,
ADD COLUMN IF NOT EXISTS verification_documents jsonb DEFAULT '[]'::jsonb;

-- Add quality score to venues
ALTER TABLE public.venues 
ADD COLUMN IF NOT EXISTS quality_score numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_quality_check timestamp with time zone,
ADD COLUMN IF NOT EXISTS quality_notes text;

-- Enable realtime for admin_activity_log
ALTER TABLE public.admin_activity_log REPLICA IDENTITY FULL;

-- Add admin_activity_log to realtime publication if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND tablename = 'admin_activity_log'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.admin_activity_log;
  END IF;
END $$;

-- Create function to calculate venue quality score
CREATE OR REPLACE FUNCTION public.calculate_venue_quality_score(venue_uuid uuid)
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  score numeric := 0;
  avg_rating numeric;
  review_count integer;
  booking_count integer;
  image_count integer;
  feature_count integer;
BEGIN
  -- Get average rating (max 40 points)
  SELECT COALESCE(AVG(rating), 0), COUNT(*) INTO avg_rating, review_count
  FROM venue_reviews WHERE venue_id = venue_uuid;
  score := score + (avg_rating * 8);
  
  -- Bonus for review count (max 10 points)
  score := score + LEAST(review_count, 10);
  
  -- Booking count bonus (max 20 points)
  SELECT COUNT(*) INTO booking_count
  FROM bookings WHERE venue_id = venue_uuid AND status = 'confirmed';
  score := score + LEAST(booking_count * 2, 20);
  
  -- Image count bonus (max 15 points)
  SELECT COUNT(*) INTO image_count
  FROM venue_images WHERE venue_id = venue_uuid;
  score := score + LEAST(image_count * 3, 15);
  
  -- Feature count bonus (max 15 points)
  SELECT COUNT(*) INTO feature_count
  FROM venue_features WHERE venue_id = venue_uuid;
  score := score + LEAST(feature_count * 3, 15);
  
  RETURN ROUND(score, 1);
END;
$$;

-- RLS policy for admins to update profiles verification
CREATE POLICY "Admins can update user verification" ON public.profiles
FOR UPDATE USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- RLS policy for admins to update venue quality scores
CREATE POLICY "Admins can update venue quality" ON public.venues
FOR UPDATE USING (is_admin(auth.uid()));