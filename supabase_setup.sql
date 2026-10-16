-- ==============================================================================
-- L'ATELIER MAISON — COMPLETE DATABASE SCHEMA SETUP
-- Run this script in the Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- ==============================================================================

-- 1. Create LEADS table if it does not already exist
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT,
    email TEXT,
    phone TEXT,
    service_type TEXT,
    total_price NUMERIC(10, 2) DEFAULT 0,
    details JSONB DEFAULT '{}'::jsonb,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create CONTACTS table
CREATE TABLE IF NOT EXISTS public.contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    address TEXT,
    service TEXT,
    budget TEXT,
    timeline TEXT,
    details TEXT,
    image_urls TEXT[] DEFAULT '{}',
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Create ORDERS table for Stripe Checkout Paid Bookings
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stripe_session_id TEXT UNIQUE NOT NULL,
    customer_name TEXT,
    customer_email TEXT,
    customer_phone TEXT,
    service_name TEXT,
    amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    currency TEXT DEFAULT 'usd',
    status TEXT DEFAULT 'paid',
    details JSONB DEFAULT '{}'::jsonb,
    lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 5. Policies for LEADS (Public insert, Authenticated read/update)
DROP POLICY IF EXISTS "Allow anonymous insert on leads" ON public.leads;
CREATE POLICY "Allow anonymous insert on leads" ON public.leads
    FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all for authenticated on leads" ON public.leads;
CREATE POLICY "Allow all for authenticated on leads" ON public.leads
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 6. Policies for CONTACTS (Public insert, Authenticated read/update)
DROP POLICY IF EXISTS "Allow anonymous insert on contacts" ON public.contacts;
CREATE POLICY "Allow anonymous insert on contacts" ON public.contacts
    FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all for authenticated on contacts" ON public.contacts;
CREATE POLICY "Allow all for authenticated on contacts" ON public.contacts
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 7. Policies for ORDERS (Public insert/select for confirmation, Authenticated full)
DROP POLICY IF EXISTS "Allow anonymous insert on orders" ON public.orders;
CREATE POLICY "Allow anonymous insert on orders" ON public.orders
    FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anonymous select on orders" ON public.orders;
CREATE POLICY "Allow anonymous select on orders" ON public.orders
    FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Allow all for authenticated on orders" ON public.orders;
CREATE POLICY "Allow all for authenticated on orders" ON public.orders
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 8. Add tables to Supabase Realtime Publication for instant CMS updates
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'orders'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'contacts'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.contacts;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'leads'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.leads;
    END IF;
END $$;
