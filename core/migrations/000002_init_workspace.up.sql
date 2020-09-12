BEGIN;

-- Add migration here.
CREATE TABLE workspace (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  -- attributes
  key resource_key,
  name resource_name,
  description resource_description,
  tags resource_tags,
  -- contraints
  CONSTRAINT workspace_key UNIQUE(key)
);

END;
