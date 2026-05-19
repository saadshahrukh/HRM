-- Add plan column to public.organizations table
ALTER TABLE public.organizations 
ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'basic';

-- Verify check constraint on plan if needed in future, e.g. 'basic', 'pro', 'enterprise'
ALTER TABLE public.organizations 
DROP CONSTRAINT IF EXISTS organizations_plan_check;

ALTER TABLE public.organizations 
ADD CONSTRAINT organizations_plan_check 
CHECK (plan IN ('basic', 'pro', 'enterprise'));
