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
  identity_id UUID REFERENCES identity (id) ON DELETE CASCADE ON UPDATE CASCADE,
  segment_id UUID REFERENCES segment (id) ON DELETE CASCADE ON UPDATE CASCADE,
  targeting_id UUID REFERENCES targeting (id) ON DELETE CASCADE ON UPDATE CASCADE NOT NULL,
  -- contraints
  CONSTRAINT targeting_rule_key UNIQUE(key, targeting_id)
);

-- used for fallthrough targeting variation
CREATE TABLE targeting_rule_variation (
  PRIMARY KEY (variation_id, targeting_rule_id),
  -- attributes
  weight INT DEFAULT 100 NOT NULL,
  -- references
  variation_id UUID REFERENCES variation (id) ON DELETE CASCADE ON UPDATE CASCADE NOT NULL,
  targeting_rule_id UUID REFERENCES targeting_rule (id) ON DELETE CASCADE ON UPDATE CASCADE NOT NULL,
  -- constraints
  CHECK (weight BETWEEN 0 AND 100)
);

END;
