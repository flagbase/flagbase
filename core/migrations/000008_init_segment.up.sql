BEGIN;

CREATE TABLE segment (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  -- attributes
  key resource_key,
  name resource_name,
  description resource_description,
  tags resource_tags,
  -- references
  project_id UUID NOT NULL REFERENCES project (id),
  -- contraints
  CONSTRAINT segment_key UNIQUE(key, project_id)
);

CREATE TYPE segment_rule_operator AS ENUM (
  'equal',
  'greater_than',
  'greater_than_or_equal',
  'contains',
  'regex'
);

CREATE TABLE segment_rule (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  -- attributes
  key resource_key,
  trait_key VARCHAR(40),
  trait_value VARCHAR(40),
  operator segment_rule_operator,
  negate BOOLEAN DEFAULT FALSE,
  -- references
  segment_id UUID NOT NULL REFERENCES segment (id),
  -- contraints
  CONSTRAINT segment_rule_key UNIQUE(key, segment_id)
);

END;
