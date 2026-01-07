
-- Migration to align families table with the application code and user-provided schema

DO $$ 
BEGIN
    -- 1. Align 'families' table columns
    
    -- Rename 'id' to 'family_id' if it exists and 'family_id' does not
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'families' AND column_name = 'id') 
       AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'families' AND column_name = 'family_id') THEN
        ALTER TABLE families RENAME COLUMN id TO family_id;
    END IF;

    -- Rename 'ration_card_number' to 'family_name' if it exists
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'families' AND column_name = 'ration_card_number') 
       AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'families' AND column_name = 'family_name') THEN
        ALTER TABLE families RENAME COLUMN ration_card_number TO family_name;
    END IF;

    -- Add 'family_name' if it still doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'families' AND column_name = 'family_name') THEN
        ALTER TABLE families ADD COLUMN family_name text;
    END IF;

    -- Add 'address' if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'families' AND column_name = 'address') THEN
        ALTER TABLE families ADD COLUMN address text;
    END IF;

    -- Add 'total_income' if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'families' AND column_name = 'total_income') THEN
        ALTER TABLE families ADD COLUMN total_income numeric DEFAULT 0;
    END IF;

    -- 2. Align 'persons' table family linkage
    
    -- Ensure 'family_id' exists in 'persons'
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'persons' AND column_name = 'family_id') THEN
        ALTER TABLE persons ADD COLUMN family_id bigint REFERENCES families(family_id);
    END IF;

END $$;
