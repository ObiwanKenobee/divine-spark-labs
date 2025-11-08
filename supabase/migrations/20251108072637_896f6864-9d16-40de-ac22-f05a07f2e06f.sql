-- Create tables for Women's Empowerment Hub features

-- Mary Magdalene Path - Fellowships
CREATE TABLE IF NOT EXISTS public.fellowships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  program_type TEXT NOT NULL, -- 'mary_magdalene', 'joanna_collective', etc.
  status TEXT NOT NULL DEFAULT 'draft', -- draft, open, active, completed
  cohort_size INTEGER,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  requirements TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Fellowship Applications
CREATE TABLE IF NOT EXISTS public.fellowship_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  fellowship_id UUID NOT NULL REFERENCES public.fellowships(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  applicant_name TEXT NOT NULL,
  email TEXT NOT NULL,
  why_apply TEXT NOT NULL,
  experience TEXT,
  goals TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, accepted, rejected, withdrawn
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Women Pioneers Map
CREATE TABLE IF NOT EXISTS public.women_pioneers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT,
  bio TEXT,
  region TEXT NOT NULL,
  country TEXT NOT NULL,
  city TEXT,
  lat DECIMAL(10, 8),
  lng DECIMAL(11, 8),
  focus_areas TEXT[], -- e.g., ['tech', 'sustainability', 'education']
  projects TEXT[],
  contact_email TEXT,
  linkedin_url TEXT,
  website_url TEXT,
  avatar_url TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Personal Transformation Journal
CREATE TABLE IF NOT EXISTS public.transformation_journal (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  entry_type TEXT NOT NULL DEFAULT 'reflection', -- reflection, milestone, discernment
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  mood TEXT, -- e.g., 'hopeful', 'challenged', 'grateful'
  tags TEXT[],
  is_private BOOLEAN DEFAULT true,
  milestone_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Investment Opportunities (Joanna Collective)
CREATE TABLE IF NOT EXISTS public.investment_opportunities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_name TEXT NOT NULL,
  description TEXT NOT NULL,
  sector TEXT NOT NULL, -- e.g., 'renewable energy', 'education', 'healthcare'
  stage TEXT NOT NULL, -- 'seed', 'series_a', 'growth', etc.
  funding_goal DECIMAL(15, 2),
  funding_raised DECIMAL(15, 2) DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  founder_id UUID REFERENCES auth.users(id),
  founder_name TEXT NOT NULL,
  location TEXT,
  impact_metrics JSONB DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'open', -- open, funded, closed
  deadline TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.fellowships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fellowship_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.women_pioneers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transformation_journal ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investment_opportunities ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Fellowships
CREATE POLICY "Anyone can view active fellowships"
ON public.fellowships FOR SELECT
USING (status IN ('open', 'active'));

CREATE POLICY "Admins can manage fellowships"
ON public.fellowships FOR ALL
USING (is_admin(auth.uid()));

-- RLS Policies for Fellowship Applications
CREATE POLICY "Users can view their own applications"
ON public.fellowship_applications FOR SELECT
USING (auth.uid() = user_id OR is_admin(auth.uid()));

CREATE POLICY "Authenticated users can apply"
ON public.fellowship_applications FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage applications"
ON public.fellowship_applications FOR ALL
USING (is_admin(auth.uid()));

-- RLS Policies for Women Pioneers
CREATE POLICY "Anyone can view verified pioneers"
ON public.women_pioneers FOR SELECT
USING (is_verified = true);

CREATE POLICY "Authenticated users can add pioneers"
ON public.women_pioneers FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage pioneers"
ON public.women_pioneers FOR ALL
USING (is_admin(auth.uid()));

-- RLS Policies for Transformation Journal
CREATE POLICY "Users can view their own journal entries"
ON public.transformation_journal FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own entries"
ON public.transformation_journal FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own entries"
ON public.transformation_journal FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own entries"
ON public.transformation_journal FOR DELETE
USING (auth.uid() = user_id);

-- RLS Policies for Investment Opportunities
CREATE POLICY "Anyone can view open opportunities"
ON public.investment_opportunities FOR SELECT
USING (status = 'open');

CREATE POLICY "Authenticated users can create opportunities"
ON public.investment_opportunities FOR INSERT
WITH CHECK (auth.uid() = founder_id);

CREATE POLICY "Founders can update their opportunities"
ON public.investment_opportunities FOR UPDATE
USING (auth.uid() = founder_id);

CREATE POLICY "Admins can manage all opportunities"
ON public.investment_opportunities FOR ALL
USING (is_admin(auth.uid()));

-- Create indexes
CREATE INDEX idx_fellowships_status ON public.fellowships(status);
CREATE INDEX idx_fellowship_applications_user ON public.fellowship_applications(user_id);
CREATE INDEX idx_fellowship_applications_fellowship ON public.fellowship_applications(fellowship_id);
CREATE INDEX idx_women_pioneers_region ON public.women_pioneers(region);
CREATE INDEX idx_women_pioneers_verified ON public.women_pioneers(is_verified);
CREATE INDEX idx_transformation_journal_user ON public.transformation_journal(user_id);
CREATE INDEX idx_investment_opportunities_status ON public.investment_opportunities(status);

-- Create triggers for updated_at
CREATE TRIGGER update_fellowships_updated_at
BEFORE UPDATE ON public.fellowships
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_women_pioneers_updated_at
BEFORE UPDATE ON public.women_pioneers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_transformation_journal_updated_at
BEFORE UPDATE ON public.transformation_journal
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_investment_opportunities_updated_at
BEFORE UPDATE ON public.investment_opportunities
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();