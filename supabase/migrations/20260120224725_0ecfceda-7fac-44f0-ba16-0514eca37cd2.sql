-- ===========================================
-- CREATE UPDATE TIMESTAMP FUNCTION FIRST
-- ===========================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- ===========================================
-- CMS TABLES FOR EASYHALL ADMIN PANEL
-- ===========================================

-- 1. Content Pages Table (for legal/static pages)
CREATE TABLE public.content_pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '[]'::jsonb,
  meta_description TEXT,
  is_published BOOLEAN DEFAULT true,
  last_updated_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. Testimonials Table
CREATE TABLE public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'Guest',
  venue_name TEXT,
  quote TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  avatar_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. FAQs Table
CREATE TABLE public.faqs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  display_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 4. Homepage Sections Table
CREATE TABLE public.homepage_sections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section_key TEXT NOT NULL UNIQUE,
  title TEXT,
  subtitle TEXT,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  background_image TEXT,
  is_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_by UUID
);

-- ===========================================
-- ENABLE RLS ON ALL TABLES
-- ===========================================

ALTER TABLE public.content_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_sections ENABLE ROW LEVEL SECURITY;

-- ===========================================
-- RLS POLICIES - CONTENT PAGES
-- ===========================================

CREATE POLICY "Anyone can view published content pages"
ON public.content_pages FOR SELECT
USING (is_published = true);

CREATE POLICY "Admins can view all content pages"
ON public.content_pages FOR SELECT
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can manage content pages"
ON public.content_pages FOR ALL
USING (is_admin(auth.uid()));

-- ===========================================
-- RLS POLICIES - TESTIMONIALS
-- ===========================================

CREATE POLICY "Anyone can view active testimonials"
ON public.testimonials FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can view all testimonials"
ON public.testimonials FOR SELECT
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can manage testimonials"
ON public.testimonials FOR ALL
USING (is_admin(auth.uid()));

-- ===========================================
-- RLS POLICIES - FAQS
-- ===========================================

CREATE POLICY "Anyone can view published FAQs"
ON public.faqs FOR SELECT
USING (is_published = true);

CREATE POLICY "Admins can view all FAQs"
ON public.faqs FOR SELECT
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can manage FAQs"
ON public.faqs FOR ALL
USING (is_admin(auth.uid()));

-- ===========================================
-- RLS POLICIES - HOMEPAGE SECTIONS
-- ===========================================

CREATE POLICY "Anyone can view active homepage sections"
ON public.homepage_sections FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can view all homepage sections"
ON public.homepage_sections FOR SELECT
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can manage homepage sections"
ON public.homepage_sections FOR ALL
USING (is_admin(auth.uid()));

-- ===========================================
-- UPDATE TIMESTAMP TRIGGERS
-- ===========================================

CREATE TRIGGER update_content_pages_updated_at
BEFORE UPDATE ON public.content_pages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_testimonials_updated_at
BEFORE UPDATE ON public.testimonials
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_faqs_updated_at
BEFORE UPDATE ON public.faqs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_homepage_sections_updated_at
BEFORE UPDATE ON public.homepage_sections
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- ===========================================
-- SEED DATA - CONTENT PAGES
-- ===========================================

INSERT INTO public.content_pages (slug, title, content, meta_description) VALUES
('terms-of-service', 'Terms of Service', '[
  {"title": "Acceptance of Terms", "content": "By accessing and using EasyHall, you accept and agree to be bound by the terms and provision of this agreement."},
  {"title": "Use License", "content": "Permission is granted to temporarily access the materials on EasyHall for personal, non-commercial transitory viewing only."},
  {"title": "Venue Listing Terms", "content": "Hosts who list venues on our platform agree to provide accurate information about their venues, maintain availability calendars, and respond to booking requests in a timely manner."},
  {"title": "Booking and Cancellation", "content": "All bookings are subject to venue availability and host confirmation. Cancellation policies vary by venue and will be clearly displayed before booking."},
  {"title": "Payment Terms", "content": "All payments are processed securely through our platform. Hosts receive payments according to our standard payout schedule after successful event completion."},
  {"title": "Liability Limitations", "content": "EasyHall acts as an intermediary between hosts and guests. We are not responsible for the condition of venues or the conduct of users."},
  {"title": "Contact Information", "content": "For any questions regarding these terms, please contact our support team through the contact page."}
]'::jsonb, 'Terms of Service for EasyHall venue booking platform'),

('privacy-policy', 'Privacy Policy', '[
  {"title": "Information We Collect", "content": "We collect information you provide directly to us, including name, email address, phone number, and payment information when you create an account or make a booking."},
  {"title": "How We Use Your Information", "content": "We use the information we collect to provide, maintain, and improve our services, process transactions, send notifications, and communicate with you."},
  {"title": "Information Sharing", "content": "We share your information with venue hosts when you make a booking, payment processors for transactions, and service providers who assist in our operations."},
  {"title": "Data Security", "content": "We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction."},
  {"title": "Your Rights", "content": "You have the right to access, correct, or delete your personal information. You can also object to processing or request data portability."},
  {"title": "Cookies and Tracking", "content": "We use cookies and similar tracking technologies to track activity on our platform and hold certain information to improve user experience."},
  {"title": "Contact Us", "content": "If you have any questions about this Privacy Policy, please contact us through our support channels."}
]'::jsonb, 'Privacy Policy for EasyHall - how we handle your data'),

('cookie-policy', 'Cookie Policy', '[
  {"title": "What Are Cookies", "content": "Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better experience."},
  {"title": "Types of Cookies We Use", "content": "We use essential cookies for site functionality, analytics cookies to understand usage patterns, and preference cookies to remember your settings."},
  {"title": "Essential Cookies", "content": "These cookies are necessary for the website to function and cannot be switched off. They are usually set in response to actions you take such as logging in or filling forms."},
  {"title": "Analytics Cookies", "content": "These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site."},
  {"title": "Managing Your Cookie Preferences", "content": "You can set your browser to block or alert you about cookies, but some parts of the site may not work properly without them."},
  {"title": "Impact of Disabling Cookies", "content": "If you disable cookies, some features of our platform may not function correctly, and your user experience may be affected."}
]'::jsonb, 'Cookie Policy for EasyHall - understanding our use of cookies');

-- ===========================================
-- SEED DATA - TESTIMONIALS
-- ===========================================

INSERT INTO public.testimonials (name, role, venue_name, quote, rating, avatar_url, is_featured, display_order) VALUES
('Michael Chen', 'Host', 'Garden Pavilion', 'The platform is incredibly easy to use. Professional photos made all the difference.', 5, 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face', true, 1),
('Elena Rodriguez', 'Host', 'Coastal Events Center', 'From zero bookings to fully booked weekends. This platform changed everything!', 5, 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face', true, 2),
('Sarah Johnson', 'Guest', NULL, 'Found the perfect venue for our wedding in just minutes. The booking process was seamless!', 5, 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face', true, 3),
('Ahmed Hassan', 'Host', 'Royal Banquet Hall', 'EasyHall helped me reach customers I never would have found otherwise. Highly recommend!', 5, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face', false, 4);

-- ===========================================
-- SEED DATA - FAQS
-- ===========================================

INSERT INTO public.faqs (question, answer, category, display_order) VALUES
('How do I book a venue?', 'Simply browse our venues, select your preferred date and time, and submit a booking request. The host will confirm your booking within 24-48 hours.', 'booking', 1),
('What payment methods do you accept?', 'We accept all major credit cards, debit cards, and bank transfers. All payments are processed securely through our platform.', 'payments', 1),
('How do I become a host?', 'Sign up for an account, select "Host" as your role, and add your venue details including photos, pricing, and availability. Our team will review and approve your listing.', 'hosting', 1),
('What is your cancellation policy?', 'Cancellation policies vary by venue. Each venue listing clearly displays its specific cancellation terms before you complete your booking.', 'booking', 2),
('How do hosts receive payments?', 'Hosts receive payments via bank transfer within 3-5 business days after the event is completed successfully.', 'payments', 2),
('Can I edit my venue listing after publishing?', 'Yes, you can edit your venue details, pricing, photos, and availability at any time from your host dashboard.', 'hosting', 2),
('Is my personal information secure?', 'Yes, we use industry-standard encryption and security measures to protect all personal and payment information.', 'general', 1),
('How do I contact support?', 'You can reach our support team through the Contact page, or email us directly. We typically respond within 24 hours.', 'general', 2);

-- ===========================================
-- SEED DATA - HOMEPAGE SECTIONS
-- ===========================================

INSERT INTO public.homepage_sections (section_key, title, subtitle, content, is_active) VALUES
('hero', 'Find Your Perfect Event Space', 'Discover and book unique venues for weddings, parties, corporate events and more', '{"categories": ["wedding", "birthday", "corporate", "reception", "party"]}'::jsonb, true),
('stats', 'Our Platform in Numbers', NULL, '{"items": [{"value": "500+", "label": "Premium Venues"}, {"value": "98%", "label": "Satisfaction Rate"}, {"value": "10K+", "label": "Events Hosted"}, {"value": "24/7", "label": "Support Available"}]}'::jsonb, true),
('how-it-works', 'How It Works', 'Book your perfect venue in three simple steps', '{"steps": [{"number": 1, "title": "Find Your Venue", "description": "Browse our curated collection of beautiful event spaces"}, {"number": 2, "title": "Book Your Date", "description": "Select your preferred date and time, then submit your booking request"}, {"number": 3, "title": "Celebrate", "description": "Enjoy your event at the perfect venue"}]}'::jsonb, true),
('cta', 'Ready to List Your Venue?', 'Join thousands of hosts earning from their spaces', '{"buttonText": "Become a Host", "buttonLink": "/signup"}'::jsonb, true);