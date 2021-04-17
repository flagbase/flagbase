BEGIN;

CREATE TABLE variation (
  id resource_id_default PRIMARY KEY,
  -- attributes
  key resource_key,
  -- meta-data
  name resource_name,
  description resource_description,
  tags resource_tags,
  -- references
  flag_id resource_id REFERENCES flag (id),
  -- contraints
  CONSTRAINT variation_key UNIQUE(key, flag_id)
);

END;
