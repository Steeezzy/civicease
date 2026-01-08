-- Verification Script: Insert Demo Data and Verify Trigger
-- Run this in Supabase SQL Editor

DO $$
DECLARE
  new_family_id uuid;
BEGIN
  -- 1. Create a demo family
  -- Note: We only insert required fields. ID is auto-generated.
  INSERT INTO families (family_name, address)
  VALUES ('Demo Family', 'Test Address')
  RETURNING family_id INTO new_family_id;

  -- 2. Insert demo persons linked to that family
  -- Assuming 'persons' table uses first_name/last_name per our previous migration
  INSERT INTO persons (first_name, last_name, annual_income, family_id)
  VALUES
  ('Demo', 'Person 1', 25000, new_family_id),
  ('Demo', 'Person 2', 15000, new_family_id);
  
  -- If your persons table uses 'full_name' instead, uncomment the line below and comment out the above:
  -- INSERT INTO persons (full_name, annual_income, family_id) VALUES ('Demo Person 1', 25000, new_family_id), ('Demo Person 2', 15000, new_family_id);

END $$;

-- 3. Verify trigger worked
-- Check if total_income is 40000
SELECT family_name, total_annual_income, total_income -- Select both possible income column names just in case
FROM families 
WHERE family_name = 'Demo Family';
