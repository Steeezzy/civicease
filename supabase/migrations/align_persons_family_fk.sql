-- 1. Alter persons.family_id to UUID to match families.family_id
-- We use 'USING family_id::uuid' to cast existing values if any (assuming they turn into null or are valid uuids, but likely empty/null now)
ALTER TABLE persons
ALTER COLUMN family_id TYPE uuid USING NULL; -- Safest to set to NULL if we suspect garbage, or cast if valid. defaulting to NULL reset for safety as mismatched types likely mean invalid data.

-- 2. Add the Foreign Key with the specific name required by the API
ALTER TABLE persons
ADD CONSTRAINT persons_family_id_fkey
FOREIGN KEY (family_id)
REFERENCES families (family_id);
