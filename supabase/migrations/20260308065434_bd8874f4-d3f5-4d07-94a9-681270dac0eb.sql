
CREATE TABLE public.saved_workouts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  workout_name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('strength', 'cardio', 'flexibility')),
  saved_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, workout_name)
);

ALTER TABLE public.saved_workouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own saved workouts"
  ON public.saved_workouts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own saved workouts"
  ON public.saved_workouts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved workouts"
  ON public.saved_workouts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
