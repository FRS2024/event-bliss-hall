
-- Add event_types column to venues table to store multiple event types
ALTER TABLE public.venues ADD COLUMN event_types TEXT[] DEFAULT '{}';
