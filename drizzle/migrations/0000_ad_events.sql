CREATE TABLE public.ad_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ad_slug text NOT NULL,
  ad_title text NOT NULL DEFAULT '',
  event_type text NOT NULL CHECK (event_type IN ('view','call','whatsapp')),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.ad_events TO anon, authenticated;
GRANT ALL ON public.ad_events TO service_role;
ALTER TABLE public.ad_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can record ad events" ON public.ad_events FOR INSERT TO anon, authenticated
WITH CHECK (length(ad_slug) BETWEEN 1 AND 120 AND length(ad_title) <= 200);
CREATE INDEX ad_events_slug_idx ON public.ad_events(ad_slug);