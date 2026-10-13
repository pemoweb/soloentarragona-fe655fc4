CREATE TABLE public.marketplace_ads (
  slug text PRIMARY KEY,
  title text NOT NULL,
  price numeric NOT NULL DEFAULT 0,
  location text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT '',
  condition text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  image_url text,
  seller_name text NOT NULL DEFAULT '',
  seller_phone text NOT NULL DEFAULT '',
  seo_title text,
  seo_description text,
  seo_image text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.marketplace_ads TO anon, authenticated;
GRANT ALL ON public.marketplace_ads TO service_role;
ALTER TABLE public.marketplace_ads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read marketplace ads" ON public.marketplace_ads FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.classified_ads (
  id text PRIMARY KEY,
  category text NOT NULL,
  title text NOT NULL,
  location text NOT NULL DEFAULT '',
  description text,
  image_url text,
  days_left integer NOT NULL DEFAULT 7,
  contact_name text,
  contact_phone text,
  contact_email text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT (id, category, title, location, description, image_url, days_left, created_at) ON public.classified_ads TO anon;
GRANT SELECT ON public.classified_ads TO authenticated;
GRANT ALL ON public.classified_ads TO service_role;
ALTER TABLE public.classified_ads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read classified ads" ON public.classified_ads FOR SELECT TO anon, authenticated USING (true);