-- SlotWise Initial Database Setup
-- Enable required extensions for UUIDs and Exclusion Constraints (temporal overlap prevention)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- Verification log
DO $$
BEGIN
    RAISE NOTICE 'SlotWise PostgreSQL initialized with btree_gist and uuid-ossp extensions.';
END $$;
