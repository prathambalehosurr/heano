-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  name TEXT,
  email TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to read all profiles
CREATE POLICY "Public profiles are viewable by everyone."
  ON profiles FOR SELECT
  USING ( true );

-- Allow users to insert their own profile
CREATE POLICY "Users can insert their own profile."
  ON profiles FOR INSERT
  WITH CHECK ( auth.uid() = id );

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile."
  ON profiles FOR UPDATE
  USING ( auth.uid() = id );


-- Create scores table (for leaderboard)
CREATE TABLE IF NOT EXISTS public.scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  score NUMERIC NOT NULL,
  mode TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  color_results JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for scores
ALTER TABLE public.scores ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read scores (for leaderboard)
CREATE POLICY "Scores are viewable by everyone."
  ON scores FOR SELECT
  USING ( true );

-- Allow authenticated users to insert scores
CREATE POLICY "Authenticated users can insert scores."
  ON scores FOR INSERT
  WITH CHECK ( auth.uid() = user_id );
