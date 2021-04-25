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
  fallthrough_targeting_variation_id UUID REFERENCES targeting_variation (id),
  flag_id UUID REFERENCES flag (id),
  environment_id UUID REFERENCES environment (id)
);

END;
