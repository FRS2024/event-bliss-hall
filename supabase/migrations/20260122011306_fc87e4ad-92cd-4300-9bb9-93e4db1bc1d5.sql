-- Fix overly permissive profile viewing policy
-- Drop the policy that allows anyone to view all profiles
DROP POLICY IF EXISTS "Users can view other profiles for chat" ON public.profiles;

-- Create a more restrictive policy that only allows authenticated users to view profiles
CREATE POLICY "Authenticated users can view profiles for chat" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.role() = 'authenticated');