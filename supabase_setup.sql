-- ==============================================================================
-- L'ATELIER MAISON  — COMPLETE ENTERPRISE DATABASE SCHEMA SETUP
-- Run this script in the Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- Fully idempotent: safe to run multiple times without data loss.
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
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
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
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Create CUSTOMERS table for comprehensive client directory & VIP tracking
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    address TEXT,
    vip_tier TEXT DEFAULT 'standard', -- standard, vip, estate_elite
    internal_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Create ORDERS table for Stripe Checkout & Manual CMS Bookings
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stripe_session_id TEXT UNIQUE,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    address TEXT,
    service_name TEXT NOT NULL,
    amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    currency TEXT DEFAULT 'usd',
    status TEXT DEFAULT 'pending', -- pending, confirmed, in_progress, completed, cancelled
    details JSONB DEFAULT '{}'::jsonb,
    internal_notes TEXT,
    scheduled_date TIMESTAMPTZ,
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Safe migrations if tables were previously created with fewer columns
DO $$
BEGIN
    -- Ensure columns exist in orders
    ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS address TEXT;
    ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS internal_notes TEXT;
    ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS scheduled_date TIMESTAMPTZ;
    ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_id UUID;
    ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();
    -- Allow stripe_session_id to be nullable for manual CMS phone orders
    ALTER TABLE public.orders ALTER COLUMN stripe_session_id DROP NOT NULL;

    -- Ensure columns exist in customers
    ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS vip_tier TEXT DEFAULT 'standard';
    ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS internal_notes TEXT;
    ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();
END $$;

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- 6. Policies for LEADS (Public insert, Authenticated read/update/delete)
DROP POLICY IF EXISTS "Allow anonymous insert on leads" ON public.leads;
CREATE POLICY "Allow anonymous insert on leads" ON public.leads
    FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all for authenticated on leads" ON public.leads;
CREATE POLICY "Allow all for authenticated on leads" ON public.leads
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 7. Policies for CONTACTS (Public insert, Authenticated read/update/delete)
DROP POLICY IF EXISTS "Allow anonymous insert on contacts" ON public.contacts;
CREATE POLICY "Allow anonymous insert on contacts" ON public.contacts
    FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all for authenticated on contacts" ON public.contacts;
CREATE POLICY "Allow all for authenticated on contacts" ON public.contacts
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 8. Policies for CUSTOMERS (Authenticated full access, Anonymous read/insert for booking sync)
DROP POLICY IF EXISTS "Allow all for authenticated on customers" ON public.customers;
CREATE POLICY "Allow all for authenticated on customers" ON public.customers
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anonymous insert/select on customers" ON public.customers;
CREATE POLICY "Allow anonymous insert/select on customers" ON public.customers
    FOR ALL TO anon USING (true) WITH CHECK (true);

-- 9. Policies for ORDERS (Public insert/select for confirmation, Authenticated full CRUD)
DROP POLICY IF EXISTS "Allow anonymous insert on orders" ON public.orders;
CREATE POLICY "Allow anonymous insert on orders" ON public.orders
    FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anonymous select on orders" ON public.orders;
CREATE POLICY "Allow anonymous select on orders" ON public.orders
    FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Allow all for authenticated on orders" ON public.orders;
CREATE POLICY "Allow all for authenticated on orders" ON public.orders
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 10. Add tables to Supabase Realtime Publication for instant CMS updates
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
        WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'customers'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.customers;
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
