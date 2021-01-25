BEGIN;

-- --------------------------
-- Targeting Rule Evaluation
-- --------------------------
-- matches (TRUE, FALSE)
--  TRUE  ->
--    if type (identity || segment) matches user context -> variation
-- FALSE  -> ignore rule
--

CREATE TYPE targeting_rule_type AS ENUM (
  'identity',
  'segment'
);

CREATE TABLE targeting_rule (
  id resource_id_default PRIMARY KEY,
  -- attributes
  key resource_key,
  type targeting_rule_type NOT NULL,
  matches BOOLEAN DEFAULT TRUE NOT NULL,
  -- references
  identity_id UUID REFERENCES identity (id),
  segment_id UUID REFERENCES segment (id),
  variation_id UUID REFERENCES variation (id),
  targeting_id UUID REFERENCES targeting (id),
  -- contraints
  CONSTRAINT targeting_rule_key UNIQUE(key, targeting_id)
);

END;
