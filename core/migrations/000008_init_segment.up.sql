BEGIN;

CREATE TABLE segment (
  id resource_id_default PRIMARY KEY,
  -- attributes
  key resource_key,
  name resource_name,
  description resource_description,
  tags resource_tags,
  -- references
  project_id resource_id REFERENCES project (id),
  -- contraints
  CONSTRAINT segment_key UNIQUE(key, project_id)
);

END;
