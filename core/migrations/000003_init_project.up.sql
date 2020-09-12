BEGIN;

CREATE TABLE project (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  -- references
  workspace_id UUID REFERENCES workspace (id),
  -- attributes
  key resource_key,
  name resource_name,
  description resource_description,
  tags resource_tags,
  -- contraints
  CONSTRAINT project_key UNIQUE(key, workspace_id)
);

END;
