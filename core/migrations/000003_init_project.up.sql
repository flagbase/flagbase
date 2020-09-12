BEGIN;

CREATE TABLE project (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  -- attributes
  key resource_key,
  name resource_name,
  description resource_description,
  tags resource_tags,
  -- references
  workspace_id UUID NOT NULL REFERENCES workspace (id),
  -- contraints
  CONSTRAINT project_key UNIQUE(key, workspace_id)
);

END;
