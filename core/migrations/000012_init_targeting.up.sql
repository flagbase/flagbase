BEGIN;

-- --------------------------
-- Simple Targeting Algorithm
-- --------------------------
-- enabled (TRUE, FALSE)
--  TRUE  ->
--    for each targeting_rule -> targeting_rule.targeting_variation
--    otherwise use fallthrough_targeting_variation
--  FALSE ->  use fallthrough_targeting_variation
--
CREATE TABLE targeting (
  id resource_id_default PRIMARY KEY,
  -- attributes
  enabled BOOLEAN DEFAULT FALSE NOT NULL,
  -- references
  flag_id UUID REFERENCES flag (id),
  environment_id UUID REFERENCES environment (id)
);

CREATE TABLE targeting_fallthrough_variation (
  PRIMARY KEY (variation_id, targeting_id),
  -- attributes
  weight INT DEFAULT 100  NOT NULL,
  -- references
  variation_id UUID REFERENCES variation (id) NOT NULL,
  targeting_id UUID REFERENCES targeting (id) NOT NULL,
  -- constraints
  CHECK (weight BETWEEN 0 AND 100)
);

END;
