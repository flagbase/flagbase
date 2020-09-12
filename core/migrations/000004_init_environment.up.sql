BEGIN;

CREATE TABLE environment (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  -- attributes
  key resource_key,
  name resource_name,
  description resource_description,
  tags resource_tags,
  -- references
  project_id UUID REFERENCES project (id),
  -- contraints
  CONSTRAINT environment_key UNIQUE(key, project_id)
);

END;
