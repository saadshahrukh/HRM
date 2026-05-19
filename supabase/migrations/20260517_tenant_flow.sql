-- Add Organizations (Tenants) Table
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Modify Users table to include role and organization_id
ALTER TABLE public."Users" 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'admin', -- 'super_admin', 'admin', 'recruiter'
ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id);

-- Create a super admin automatically if the email is provided 
-- (Assuming Saad's email, modify as needed)
UPDATE public."Users" SET role = 'super_admin' WHERE email = 'saadshahrukh@example.com';

-- Organization Memberships (For complex RBAC later)
CREATE TABLE IF NOT EXISTS public.organization_memberships (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_email TEXT NOT NULL,
    role TEXT DEFAULT 'recruiter',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add organization_id to Interviews to make them tenant-specific
ALTER TABLE public."Interviews"
ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id);

-- Enable RLS (Row Level Security) for Organizations
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Super admins can manage all organizations" 
ON public.organizations FOR ALL USING (
  EXISTS (SELECT 1 FROM public."Users" WHERE email = current_user AND role = 'super_admin')
);
CREATE POLICY "Admins can view their own organization" 
ON public.organizations FOR SELECT USING (
  id IN (SELECT organization_id FROM public."Users" WHERE email = current_user)
);
