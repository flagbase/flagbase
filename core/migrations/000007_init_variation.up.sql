BEGIN;

CREATE TABLE variation (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  -- attributes
  key resource_key,
  name resource_name,
  description resource_description,
  tags resource_tags,
  -- references
  flag_id UUID NOT NULL REFERENCES flag (id),
  -- contraints
  CONSTRAINT variation_key UNIQUE(key, flag_id)
);

END;
