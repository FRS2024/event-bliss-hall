
-- Add the newly created user as a super admin
INSERT INTO public.admin_users (user_id, role, is_active, permissions)
VALUES (
  'd01344bc-5e57-4c97-8b85-da4cfa1f8dc0',
  'super_admin',
  true,
  '{}'::jsonb
)
ON CONFLICT (user_id) 
DO UPDATE SET 
  role = 'super_admin',
  is_active = true,
  updated_at = now();
