-- Drop the trigger and function we just created (no longer needed)
DROP TRIGGER IF EXISTS protect_premium_status ON public.profiles;
DROP FUNCTION IF EXISTS public.prevent_premium_status_update();

-- Remove premium_status column from profiles
ALTER TABLE public.profiles DROP COLUMN IF EXISTS premium_status;