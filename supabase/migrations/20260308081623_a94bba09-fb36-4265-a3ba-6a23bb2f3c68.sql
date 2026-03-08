
-- Rename existing columns to match requested schema
ALTER TABLE public.subscriptions RENAME COLUMN status TO subscription_status;
ALTER TABLE public.subscriptions RENAME COLUMN created_at TO subscription_start_date;
ALTER TABLE public.subscriptions RENAME COLUMN expires_at TO subscription_end_date;

-- Add foreign key linking to profiles
ALTER TABLE public.subscriptions
  ADD CONSTRAINT fk_subscriptions_profile
  FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;
