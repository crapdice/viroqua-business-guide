# Database Schema

```sql
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. CATEGORIES TABLE
-- Taxonomy for businesses (e.g., Dining, Retail, Services)
create table public.categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text not null unique,
  icon_text text, -- e.g. "🍔" or a lucide icon name
  parent_id uuid references public.categories(id), -- Hierarchy: Sector -> Group -> Category
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. OWNERS TABLE (and Profiles)
-- In Supabase, users are managed in auth.users. 
-- We create a public 'profiles' table for general user info, 
-- and an 'owners' table for specific business-owner details/verification.

create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  avatar_url text,
  updated_at timestamp with time zone
);

create table public.owners (
  id uuid references public.profiles(id) on delete cascade primary key,
  contact_email text,
  phone_number text,
  is_verified boolean default false,
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. BUSINESSES TABLE
create table public.businesses (
  id uuid default uuid_generate_v4() primary key,
  owner_id uuid references public.owners(id), -- Nullable: listings can be unclaimed
  category_id uuid references public.categories(id),
  name text not null,
  slug text not null unique,
  description text,
  address text,
  city text default 'Viroqua',
  state text default 'WI',
  zip text,
  latitude double precision,
  longitude double precision,
  website text,
  phone text,
  email text,
  hero_image_url text,
  opening_hours jsonb, -- Structured hours e.g. {"mon": "9-5", "tue": "9-5"}
  instagram_url text,
  facebook_url text,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. REVIEWS TABLE
create table public.reviews (
  id uuid default uuid_generate_v4() primary key,
  business_id uuid references public.businesses(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete set null,
  rating integer check (rating >= 1 and rating <= 5) not null,
  comment text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security (RLS) - Basic Policy Drafts

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.owners enable row level security;
alter table public.businesses enable row level security;
alter table public.reviews enable row level security;
```
