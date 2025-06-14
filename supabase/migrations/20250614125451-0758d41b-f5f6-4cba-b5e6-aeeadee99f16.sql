
-- Add category column to venues table
ALTER TABLE public.venues 
ADD COLUMN category TEXT;

-- Update the category field to be required for new venues (but allow existing venues to have null)
-- We'll handle existing venues with a default category
UPDATE public.venues 
SET category = 'Event Space' 
WHERE category IS NULL;

-- Now make it required for future inserts
ALTER TABLE public.venues 
ALTER COLUMN category SET NOT NULL;
