BEGIN;

CREATE TYPE segment_rule_operator AS ENUM (
  'equal',
  'greater_than',
  'greater_than_or_equal',
  'contains',
  'regex'
);

CREATE TABLE segment_rule (
  id resource_id_default PRIMARY KEY,
  -- attributes
  key resource_key,
  trait_key VARCHAR(40),
  trait_value VARCHAR(40),
  operator segment_rule_operator,
  negate BOOLEAN DEFAULT FALSE,
  -- references
  segment_id resource_id REFERENCES segment (id),
  environment_id resource_id REFERENCES environment (id),
  -- contraints
  CONSTRAINT segment_rule_key UNIQUE(key, segment_id, environment_id)
);

END;
