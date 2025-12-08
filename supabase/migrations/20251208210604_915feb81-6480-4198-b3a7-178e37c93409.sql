-- Enable realtime for events table
ALTER PUBLICATION supabase_realtime ADD TABLE public.events;

-- Enable realtime for forums table  
ALTER PUBLICATION supabase_realtime ADD TABLE public.forums;