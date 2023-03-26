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

-- Add unique index when both workspace_id and project_id are null
CREATE UNIQUE INDEX access_key_no_workspace_project_idx ON access ("key") WHERE workspace_id IS NULL AND project_id IS NULL;

-- Add unique index when workspace_id is not null and project_id is null
CREATE UNIQUE INDEX access_key_workspace_id_no_project_idx ON access ("key", workspace_id) WHERE workspace_id IS NOT NULL AND project_id IS NULL;

-- Add unique index when workspace_id and project_id are not null
CREATE UNIQUE INDEX access_key_workspace_id_project_id_idx ON access ("key", workspace_id, project_id) WHERE workspace_id IS NOT NULL AND project_id IS NOT NULL;

END;
