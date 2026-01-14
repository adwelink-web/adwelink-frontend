-- Super Admin Access RLS Policies Migration
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor)

-- Step 1: Create helper function to check if current user is super admin
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN (SELECT auth.jwt() ->> 'email') IN ('thekashidasmongre@gmail.com');
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.is_super_admin() TO authenticated;

-- Step 2: Add super admin access policies for all relevant tables
-- These policies allow super admins to view all data regardless of institute_id

-- Leads table
CREATE POLICY "Super admins can view all leads" ON public.leads
  FOR SELECT TO authenticated
  USING (public.is_super_admin());

-- Activity Log table
CREATE POLICY "Super admins can view all activity logs" ON public.activity_log
  FOR SELECT TO authenticated
  USING (public.is_super_admin());

-- Alerts table
CREATE POLICY "Super admins can view all alerts" ON public.alerts
  FOR SELECT TO authenticated
  USING (public.is_super_admin());

-- Payments table  
CREATE POLICY "Super admins can view all payments" ON public.payments
  FOR SELECT TO authenticated
  USING (public.is_super_admin());

-- Support Tickets table
CREATE POLICY "Super admins can view all support tickets" ON public.support_tickets
  FOR SELECT TO authenticated
  USING (public.is_super_admin());

-- Institutes table
CREATE POLICY "Super admins can view all institutes" ON public.institutes
  FOR SELECT TO authenticated
  USING (public.is_super_admin());

-- Students table
CREATE POLICY "Super admins can view all students" ON public.students
  FOR SELECT TO authenticated
  USING (public.is_super_admin());

-- Courses table
CREATE POLICY "Super admins can view all courses" ON public.courses
  FOR SELECT TO authenticated
  USING (public.is_super_admin());

-- AI Chat History table (for analytics)
CREATE POLICY "Super admins can view all chat history" ON public.ai_chat_history
  FOR SELECT TO authenticated
  USING (public.is_super_admin());
