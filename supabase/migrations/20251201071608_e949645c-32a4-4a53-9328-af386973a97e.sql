-- Create inquiries table for contact form submissions
CREATE TABLE public.inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  organization TEXT,
  message TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit inquiries"
  ON public.inquiries
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view all inquiries"
  ON public.inquiries
  FOR SELECT
  USING (is_admin(auth.uid()));

CREATE POLICY "Admins can update inquiries"
  ON public.inquiries
  FOR UPDATE
  USING (is_admin(auth.uid()));

-- Create events table for community events
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  date TIMESTAMPTZ NOT NULL,
  description TEXT,
  location TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view events"
  ON public.events
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create events"
  ON public.events
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own events"
  ON public.events
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own events"
  ON public.events
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all events"
  ON public.events
  FOR ALL
  USING (is_admin(auth.uid()));

-- Create forums table for discussion topics
CREATE TABLE public.forums (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.forums ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view forum topics"
  ON public.forums
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create topics"
  ON public.forums
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own topics"
  ON public.forums
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own topics"
  ON public.forums
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all topics"
  ON public.forums
  FOR ALL
  USING (is_admin(auth.uid()));

-- Create partnerships table
CREATE TABLE public.partnerships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  sector TEXT NOT NULL,
  region TEXT NOT NULL,
  lat NUMERIC,
  lng NUMERIC,
  status TEXT DEFAULT 'active',
  description TEXT,
  contact_email TEXT,
  website_url TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.partnerships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active partnerships"
  ON public.partnerships
  FOR SELECT
  USING (status = 'active' OR is_admin(auth.uid()));

CREATE POLICY "Authenticated users can create partnerships"
  ON public.partnerships
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own partnerships"
  ON public.partnerships
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by);

CREATE POLICY "Admins can manage all partnerships"
  ON public.partnerships
  FOR ALL
  USING (is_admin(auth.uid()));

-- Create programs table
CREATE TABLE public.programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  seats INTEGER,
  status TEXT DEFAULT 'active',
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active programs"
  ON public.programs
  FOR SELECT
  USING (status = 'active' OR is_admin(auth.uid()));

CREATE POLICY "Admins can manage all programs"
  ON public.programs
  FOR ALL
  USING (is_admin(auth.uid()));

-- Create program_members table for tracking program participation
CREATE TABLE public.program_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID REFERENCES public.programs(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  status TEXT DEFAULT 'active',
  UNIQUE(program_id, user_id)
);

ALTER TABLE public.program_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own memberships"
  ON public.program_members
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR is_admin(auth.uid()));

CREATE POLICY "Authenticated users can join programs"
  ON public.program_members
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave programs"
  ON public.program_members
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all memberships"
  ON public.program_members
  FOR ALL
  USING (is_admin(auth.uid()));

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_forums_updated_at
  BEFORE UPDATE ON public.forums
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_partnerships_updated_at
  BEFORE UPDATE ON public.partnerships
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_programs_updated_at
  BEFORE UPDATE ON public.programs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better query performance
CREATE INDEX idx_events_date ON public.events(date);
CREATE INDEX idx_events_user_id ON public.events(user_id);
CREATE INDEX idx_forums_created_at ON public.forums(created_at DESC);
CREATE INDEX idx_forums_user_id ON public.forums(user_id);
CREATE INDEX idx_partnerships_status ON public.partnerships(status);
CREATE INDEX idx_programs_status ON public.programs(status);
CREATE INDEX idx_program_members_user_id ON public.program_members(user_id);
CREATE INDEX idx_program_members_program_id ON public.program_members(program_id);