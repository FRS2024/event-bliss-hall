-- Phase 1: Critical Foundations Database Migration

-- 1. Add user suspension columns to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_suspended BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS suspended_at TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS suspended_reason TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS suspended_by UUID;

-- 2. Create venue_categories table for dynamic categories
CREATE TABLE IF NOT EXISTS venue_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  color TEXT DEFAULT 'bg-gray-100 text-gray-800',
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  venue_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on venue_categories
ALTER TABLE venue_categories ENABLE ROW LEVEL SECURITY;

-- RLS policies for venue_categories
CREATE POLICY "Anyone can view active categories" 
ON venue_categories FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage categories" 
ON venue_categories FOR ALL 
USING (is_admin(auth.uid()));

-- 3. Add admin_notes to flagged_content (if not exists)
ALTER TABLE flagged_content ADD COLUMN IF NOT EXISTS admin_notes TEXT;
ALTER TABLE flagged_content ADD COLUMN IF NOT EXISTS resolution_type TEXT;

-- 4. Insert default venue categories
INSERT INTO venue_categories (name, description, icon, color, display_order) VALUES
  ('Wedding Hall', 'Venues specialized for wedding ceremonies and receptions', 'Heart', 'bg-pink-100 text-pink-800', 1),
  ('Conference Room', 'Professional meeting and conference spaces', 'Presentation', 'bg-blue-100 text-blue-800', 2),
  ('Event Space', 'Versatile spaces for various events', 'PartyPopper', 'bg-purple-100 text-purple-800', 3),
  ('Restaurant', 'Dining venues with event hosting capabilities', 'UtensilsCrossed', 'bg-orange-100 text-orange-800', 4),
  ('Hotel', 'Hotels with event facilities', 'Building', 'bg-green-100 text-green-800', 5),
  ('Outdoor Venue', 'Open-air and garden venues', 'Trees', 'bg-teal-100 text-teal-800', 6),
  ('Corporate Space', 'Business and corporate event venues', 'Briefcase', 'bg-gray-100 text-gray-800', 7),
  ('Cultural Center', 'Cultural and community event spaces', 'Landmark', 'bg-indigo-100 text-indigo-800', 8)
ON CONFLICT (name) DO NOTHING;

-- 5. Add RLS policy for admins to view all bookings
CREATE POLICY "Admins can view all bookings" 
ON bookings FOR SELECT 
USING (is_admin(auth.uid()));

-- 6. Add RLS policy for admins to update bookings
CREATE POLICY "Admins can update all bookings" 
ON bookings FOR UPDATE 
USING (is_admin(auth.uid()));

-- 7. Create admin_activity_log for real activity tracking
CREATE TABLE IF NOT EXISTS admin_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES admin_users(id),
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  details JSONB DEFAULT '{}',
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on admin_activity_log
ALTER TABLE admin_activity_log ENABLE ROW LEVEL SECURITY;

-- RLS policies for admin_activity_log
CREATE POLICY "Admins can view activity log" 
ON admin_activity_log FOR SELECT 
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can insert activity log" 
ON admin_activity_log FOR INSERT 
WITH CHECK (is_admin(auth.uid()));