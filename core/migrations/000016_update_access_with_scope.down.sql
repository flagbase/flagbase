BEGIN;

-- Step 1: Drop the access_key constraint
ALTER TABLE access
DROP CONSTRAINT access_key;

-- Step 2: Restore the original access_key constraint
ALTER TABLE access
ADD CONSTRAINT access_key UNIQUE(key);

-- Step 3: Drop the foreign key constraints and columns
ALTER TABLE access
DROP CONSTRAINT IF EXISTS access_workspace_id_fkey,
DROP CONSTRAINT IF EXISTS access_project_id_fkey,
DROP COLUMN IF EXISTS workspace_id,
DROP COLUMN IF EXISTS project_id,
DROP COLUMN IF EXISTS scope;

-- Step 4: Drop the access_scope type
DROP TYPE IF EXISTS access_scope;


END;
