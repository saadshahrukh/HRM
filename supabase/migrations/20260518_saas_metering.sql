-- Add columns to public.organizations table if they don't exist
ALTER TABLE public.organizations 
ADD COLUMN IF NOT EXISTS credits_remaining INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active', -- 'active', 'deleted'
ADD COLUMN IF NOT EXISTS created_by_admin_email TEXT;

-- Verify Users role supports ceo and super_admin
-- Update Saad's email role in the database to super_admin (adjust as necessary)
UPDATE public."Users" 
SET role = 'super_admin' 
WHERE email IN ('saad122sharukh@gmail.com', 'saadshahrukh141@gmail.com');

-- Update status constraint on organizations
ALTER TABLE public.organizations 
DROP CONSTRAINT IF EXISTS organizations_status_check;

ALTER TABLE public.organizations 
ADD CONSTRAINT organizations_status_check 
CHECK (status IN ('active', 'deleted'));
