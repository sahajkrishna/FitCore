
CREATE TABLE public.workout_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  workout_name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('strength', 'cardio', 'flexibility')),
  date_completed TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  duration TEXT,
  calories TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.workout_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own workout progress"
  ON public.workout_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own workout progress"
  ON public.workout_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workout progress"
  ON public.workout_progress FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
