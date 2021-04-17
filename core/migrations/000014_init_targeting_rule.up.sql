BEGIN;

-- --------------------------
-- Targeting Rule Evaluation
-- --------------------------
-- matches (TRUE, FALSE)
--  TRUE  ->
--    if type (trait || identity || segment) matches user context -> variation
-- FALSE  -> ignore rule
--

CREATE TYPE targeting_rule_type AS ENUM (
  'trait',
  'identity',
  'segment'
);

CREATE TABLE targeting_rule (
  id resource_id_default PRIMARY KEY,
  -- attributes
  key resource_key,
  type targeting_rule_type NOT NULL,
  trait_key VARCHAR(40),
  trait_value VARCHAR(40),
  operator rule_operand,
  negate BOOLEAN DEFAULT TRUE NOT NULL,
  -- meta-data
  name resource_name,
  description resource_description,
  tags resource_tags,
  -- references
  identity_id UUID REFERENCES identity (id),
  segment_id UUID REFERENCES segment (id),
  variation_id UUID REFERENCES variation (id),
  targeting_id UUID REFERENCES targeting (id),
  -- contraints
  CONSTRAINT targeting_rule_key UNIQUE(key, targeting_id)
);

END;
