CREATE TABLE public.ai_workout_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  fitness_goal TEXT NOT NULL,
  experience_level TEXT NOT NULL,
  days_per_week INTEGER NOT NULL,
  workout_plan JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.ai_workout_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own AI plans"
  ON public.ai_workout_plans FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own AI plans"
  ON public.ai_workout_plans FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own AI plans"
  ON public.ai_workout_plans FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);