-- Add user_role enum type
CREATE TYPE public.user_role AS ENUM ('guest', 'host');

-- Add user_role column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN user_role public.user_role DEFAULT 'guest';

-- Update the handle_new_user function to store role from metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, user_role)
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data->>'full_name',
    COALESCE((NEW.raw_user_meta_data->>'user_role')::public.user_role, 'guest')
  );
  RETURN NEW;
END;
$$;