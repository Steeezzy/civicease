-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Enums
create type user_role as enum ('revenue_officer', 'higher_official');

-- Tables

-- 1. Profiles (linked to auth.users)
-- This table extends the default Supabase auth.users table
create table profiles (
  id uuid references auth.users not null primary key,
  full_name text,
  role user_role default 'revenue_officer',
  created_at timestamp with time zone default timezone('utc'::text, now())
);
-- RLS Policies for profiles
alter table profiles enable row level security;
create policy "Public profiles are viewable by everyone." on profiles for select using (true);
create policy "Users can insert their own profile." on profiles for insert with check ((select auth.uid()) = id);
create policy "Users can update own profile." on profiles for update using ((select auth.uid()) = id);

-- 2. Families
create table families (
  id uuid primary key default uuid_generate_v4(),
  family_head_id uuid, -- will link to citizens later
  address text,
  ration_card_number text unique,
  total_annual_income numeric default 0,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
alter table families enable row level security;
-- For simplicity, authenticated users can view/edit all families (Revenue Officer use case)
create policy "Authenticated users can view families" on families for select to authenticated using (true);
create policy "Authenticated users can insert families" on families for insert to authenticated with check (true);
create policy "Authenticated users can update families" on families for update to authenticated using (true);

-- 3. Citizens
create table citizens (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null,
  dob date,
  gender text,
  phone text,
  aadhar_number text unique,
  family_id uuid references families(id),
  income numeric default 0, -- Individual income to help calculate family total
  created_at timestamp with time zone default timezone('utc'::text, now())
);
alter table citizens enable row level security;
create policy "Authenticated users can view citizens" on citizens for select to authenticated using (true);
create policy "Authenticated users can insert citizens" on citizens for insert to authenticated with check (true);
create policy "Authenticated users can update citizens" on citizens for update to authenticated using (true);

-- Add foreign key back to families for head (Circular dependency resolution)
alter table families add constraint fk_family_head foreign key (family_head_id) references citizens(id);

-- 4. Service Types
create table service_types (
  id uuid primary key default uuid_generate_v4(),
  name text unique not null,
  validity_days int,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
alter table service_types enable row level security;
create policy "Authenticated users can view service types" on service_types for select to authenticated using (true);
-- Seed data
insert into service_types (name, validity_days) values 
('Income Certificate', 180),
('Community Certificate', 3650),
('Nativity Certificate', 3650),
('Legal Heir Certificate', 3650);

-- 5. Service Records
create table service_records (
  id uuid primary key default uuid_generate_v4(),
  citizen_id uuid references citizens(id) not null,
  service_type_id uuid references service_types(id) not null,
  issued_by uuid references profiles(id),
  issue_date timestamp with time zone default timezone('utc'::text, now()),
  status text default 'issued',
  comments text
);
alter table service_records enable row level security;
create policy "Authenticated users can view service records" on service_records for select to authenticated using (true);
create policy "Authenticated users can insert service records" on service_records for insert to authenticated with check (true);

-- 6. Official Postings (For Higher Officials to manage)
create table official_postings (
  id uuid primary key default uuid_generate_v4(),
  official_id uuid references profiles(id),
  designation text,
  location text,
  start_date date,
  end_date date,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
alter table official_postings enable row level security;
create policy "Authenticated users can view postings" on official_postings for select to authenticated using (true);
create policy "Higher officials can manage postings" on official_postings for all to authenticated using (
  exists (select 1 from profiles where id = auth.uid() and role = 'higher_official')
);
