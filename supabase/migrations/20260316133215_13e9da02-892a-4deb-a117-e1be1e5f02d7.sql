-- Create a trigger that prevents users from changing premium_status directly
-- Only the service role (used by edge functions) can bypass this
CREATE OR REPLACE FUNCTION public.prevent_premium_status_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- If premium_status is being changed, revert it to the old value
  -- Service role bypasses RLS but this trigger still fires;
  -- we check if the current role is authenticated (not service_role)
  IF NEW.premium_status IS DISTINCT FROM OLD.premium_status THEN
    IF current_setting('role') != 'service_role' THEN
      NEW.premium_status := OLD.premium_status;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER protect_premium_status
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_premium_status_update();