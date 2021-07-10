BEGIN;

CREATE TABLE segment_rule (
  id resource_id_default PRIMARY KEY,
  -- attributes
  key resource_key,
  trait_key VARCHAR(40),
  trait_value VARCHAR(40),
  operator rule_operand,
  negate BOOLEAN DEFAULT FALSE NOT NULL,
  -- meta-data
  name resource_name,
  description resource_description,
  tags resource_tags,
  -- references
  segment_id resource_id REFERENCES segment (id) ON DELETE CASCADE ON UPDATE CASCADE,
  environment_id resource_id REFERENCES environment (id) ON DELETE CASCADE ON UPDATE CASCADE,
  -- contraints
  CONSTRAINT segment_rule_key UNIQUE(key, segment_id, environment_id)
);

END;
