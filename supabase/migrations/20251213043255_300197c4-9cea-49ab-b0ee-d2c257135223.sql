-- Email templates table for notification management
CREATE TABLE IF NOT EXISTS public.email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  variables JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Platform settings table for configuration
CREATE TABLE IF NOT EXISTS public.platform_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES admin_users(id),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Ticket responses for support ticket conversations
CREATE TABLE IF NOT EXISTS public.ticket_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID REFERENCES support_tickets(id) ON DELETE CASCADE,
  admin_id UUID REFERENCES admin_users(id),
  content TEXT NOT NULL,
  is_internal BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_responses ENABLE ROW LEVEL SECURITY;

-- RLS policies for email_templates
CREATE POLICY "Admins can manage email templates" ON public.email_templates
FOR ALL USING (is_admin(auth.uid()));

-- RLS policies for platform_settings
CREATE POLICY "Admins can view platform settings" ON public.platform_settings
FOR SELECT USING (is_admin(auth.uid()));

CREATE POLICY "Super admins can manage platform settings" ON public.platform_settings
FOR ALL USING (get_admin_role(auth.uid()) = 'super_admin');

-- RLS policies for ticket_responses
CREATE POLICY "Admins can manage ticket responses" ON public.ticket_responses
FOR ALL USING (is_admin(auth.uid()));

-- Insert default platform settings
INSERT INTO public.platform_settings (key, value, description) VALUES
('platform_name', '"EASYHALL"', 'Platform display name'),
('contact_email', '"support@easyhall.com"', 'Support contact email'),
('booking_fee_percentage', '10', 'Platform booking fee percentage'),
('min_booking_hours', '2', 'Minimum booking duration in hours'),
('max_booking_days', '365', 'Maximum booking days in advance'),
('currency', '"MAD"', 'Default currency code'),
('timezone', '"Africa/Casablanca"', 'Default timezone')
ON CONFLICT (key) DO NOTHING;

-- Insert default email templates
INSERT INTO public.email_templates (name, subject, body, variables) VALUES
('booking_confirmation', 'Booking Confirmation - {{venue_name}}', 'Dear {{guest_name}},\n\nYour booking has been confirmed!\n\nVenue: {{venue_name}}\nDate: {{event_date}}\nTime: {{start_time}} - {{end_time}}\n\nThank you for choosing EASYHALL!', '["guest_name", "venue_name", "event_date", "start_time", "end_time"]'),
('booking_cancelled', 'Booking Cancelled - {{venue_name}}', 'Dear {{guest_name}},\n\nYour booking has been cancelled.\n\nVenue: {{venue_name}}\nDate: {{event_date}}\n\nIf you have questions, please contact support.', '["guest_name", "venue_name", "event_date"]'),
('welcome_email', 'Welcome to EASYHALL!', 'Dear {{user_name}},\n\nWelcome to EASYHALL! We''re excited to have you on board.\n\nStart exploring venues and book your perfect event space today!', '["user_name"]')
ON CONFLICT DO NOTHING;