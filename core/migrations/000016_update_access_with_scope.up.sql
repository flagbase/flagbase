BEGIN;

-- Step 1: Create the access_scope type
CREATE TYPE access_scope AS ENUM (
  'instance',
  'workspace',
  'project'
);

-- Step 2: Alter the access table
ALTER TABLE access
ADD COLUMN scope access_scope NOT NULL DEFAULT 'instance',
ADD COLUMN workspace_id UUID NULL,
ADD COLUMN project_id UUID NULL;

-- Step 3: Add foreign key constraints
ALTER TABLE access
ADD FOREIGN KEY (workspace_id) REFERENCES workspace (id) ON DELETE CASCADE ON UPDATE CASCADE,
ADD FOREIGN KEY (project_id) REFERENCES project (id) ON DELETE CASCADE ON UPDATE CASCADE;

-- Step 4: Update the access_key constraint
ALTER TABLE access
DROP CONSTRAINT access_key;
ALTER TABLE access
ADD CONSTRAINT access_key UNIQUE(key, workspace_id, project_id);

END;
