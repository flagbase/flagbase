BEGIN;

-- Drop time boundary columns from targeting rule
ALTER TABLE targeting_rule
DROP COLUMN IF EXISTS enabled,
DROP COLUMN IF EXISTS effective_start_timestamp,
DROP COLUMN IF EXISTS effective_end_timestamp;

END;