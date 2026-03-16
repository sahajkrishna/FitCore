-- 1. Fix profiles policies: drop public-role policies, recreate as authenticated
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Revoke column-level UPDATE on premium_status from authenticated/anon
REVOKE UPDATE (premium_status) ON public.profiles FROM authenticated;
REVOKE UPDATE (premium_status) ON public.profiles FROM anon;

-- 2. Fix subscriptions: remove INSERT policy (only server-side via service role)
DROP POLICY IF EXISTS "Users can insert their own subscriptions" ON public.subscriptions;