BEGIN;

-- --------------------------
-- Simple Targeting Algorithm
-- --------------------------
-- enabled (TRUE, FALSE)
--  TRUE  ->
--    if rules exist  -> derive from targeting_rule
--    else            -> derive from targeting_weights
--  FALSE ->  use fallthrough_variation
--
CREATE TABLE targeting (
  id resource_id_default PRIMARY KEY,
  -- attributes
  enabled BOOLEAN DEFAULT FALSE NOT NULL,
  -- references
  fallthrough_variation_id UUID REFERENCES variation (id),
  flag_id UUID REFERENCES flag (id),
  environment_id UUID REFERENCES environment (id)
);

END;
