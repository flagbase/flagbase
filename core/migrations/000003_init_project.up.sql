BEGIN;

CREATE TABLE project (
  id resource_id_default PRIMARY KEY,
  -- attributes
  key resource_key,
  -- meta-data
  name resource_name,
  description resource_description,
  tags resource_tags,
  -- references
  workspace_id resource_id REFERENCES workspace (id) ON DELETE CASCADE ON UPDATE CASCADE,
  -- contraints
  CONSTRAINT project_key UNIQUE(key, workspace_id)
);

END;
