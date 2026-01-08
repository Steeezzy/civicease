-- =========================================================
-- 0. EXTENSIONS
-- =========================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================================================
-- 1. USER ROLES
-- =========================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('revenue_officer', 'higher_official');
  END IF;
END$$;

-- =========================================================
-- 2. PROFILES (Auth-linked officials)
-- =========================================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  role user_role DEFAULT 'revenue_officer',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Profiles view own" ON profiles;
DROP POLICY IF EXISTS "Profiles insert own" ON profiles;
DROP POLICY IF EXISTS "Profiles update own" ON profiles;

CREATE POLICY "Profiles view own"
ON profiles
FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Profiles insert own"
ON profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "Profiles update own"
ON profiles
FOR UPDATE
USING (auth.uid() = id);

-- =========================================================
-- 3. OFFICIAL POSTINGS
-- =========================================================
CREATE TABLE IF NOT EXISTS official_postings (
  posting_id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  official_id uuid REFERENCES profiles(id),
  designation text,
  location text,
  start_date date,
  end_date date,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE official_postings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "View postings" ON official_postings;

CREATE POLICY "View postings"
ON official_postings
FOR SELECT
TO authenticated
USING (true);

-- =========================================================
-- 4. SERVICE TYPES
-- =========================================================
CREATE TABLE IF NOT EXISTS service_types (
  service_type_id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name text UNIQUE NOT NULL,
  validity_days int,
  created_at timestamptz DEFAULT now()
);

INSERT INTO service_types (name, validity_days)
VALUES
  ('Income Certificate', 180),
  ('Community Certificate', 3650),
  ('Nativity Certificate', 3650),
  ('Legal Heir Certificate', 3650)
ON CONFLICT (name) DO NOTHING;

-- =========================================================
-- 5. SERVICE RECORDS
-- =========================================================
CREATE TABLE IF NOT EXISTS service_records (
  service_record_id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  person_id bigint REFERENCES persons(person_id),
  family_id bigint REFERENCES families(family_id),
  service_type_id bigint REFERENCES service_types(service_type_id),
  issued_by uuid REFERENCES profiles(id),
  issued_at timestamptz DEFAULT now(),
  status text DEFAULT 'issued',
  remarks text
);

ALTER TABLE service_records ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "View services" ON service_records;
DROP POLICY IF EXISTS "Insert services" ON service_records;

CREATE POLICY "View services"
ON service_records
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Insert services"
ON service_records
FOR INSERT
TO authenticated
WITH CHECK (true);

-- =========================================================
-- 6. FAMILY INCOME RECALCULATION FUNCTION
-- =========================================================
CREATE OR REPLACE FUNCTION recalc_family_income(fid bigint)
RETURNS void AS $$
BEGIN
  -- Prevent running if fid is NULL
  IF fid IS NULL THEN
    RETURN;
  END IF;

  UPDATE families
  SET total_income = COALESCE(
    (SELECT SUM(annual_income) FROM persons WHERE family_id = fid),
    0
  )
  WHERE family_id = fid;
END;
$$ LANGUAGE plpgsql;

-- =========================================================
-- 7. TRIGGER FOR AUTO FAMILY INCOME UPDATE
-- =========================================================
CREATE OR REPLACE FUNCTION trg_update_family_income()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    PERFORM recalc_family_income(OLD.family_id);
  
  ELSIF TG_OP = 'UPDATE' THEN
    -- Recalculate for the new family
    PERFORM recalc_family_income(NEW.family_id);
    
    -- [FIX] If the person moved to a different family, recalculate the old family's income too
    IF OLD.family_id IS DISTINCT FROM NEW.family_id THEN
      PERFORM recalc_family_income(OLD.family_id);
    END IF;
    
  ELSIF TG_OP = 'INSERT' THEN
    PERFORM recalc_family_income(NEW.family_id);
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_family_income ON persons;

-- [FIX] Added family_id to the UPDATE trigger list to catch family moves
CREATE TRIGGER update_family_income
AFTER INSERT OR UPDATE OF annual_income, family_id OR DELETE
ON persons
FOR EACH ROW
EXECUTE FUNCTION trg_update_family_income();

-- =========================================================
-- 8. PREVENT DUPLICATE ACTIVE SERVICES
-- =========================================================
CREATE UNIQUE INDEX IF NOT EXISTS uniq_active_service
ON service_records (person_id, service_type_id)
WHERE status = 'issued';
