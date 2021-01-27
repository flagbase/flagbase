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

CREATE TABLE targeting_weight (
  PRIMARY KEY (targeting_id, variation_id),
  -- attributes
  weight INT NOT NULL DEFAULT 0,
  -- references
  targeting_id UUID REFERENCES targeting (id),
  variation_id UUID REFERENCES variation (id) -- variation that is being targeted
);

-- verify targeting weight doesn't exceed 100
CREATE FUNCTION targeting_weight_verification() RETURNS TRIGGER AS $$
BEGIN
    IF coalesce(
      (select sum(weight)
        from
          targeting_weight
        where
          type = NEW.type AND targeting_id = NEW.targeting_id
      ), 0) + coalesce(NEW.weight, 0) > 100 THEN
      RAISE EXCEPTION 'targeting_weight aggregation exceeds 100%', NEW.targeting_id;
    END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER targeting_weight_verification_trigger
  BEFORE INSERT OR UPDATE
  ON targeting_weight
  FOR EACH ROW EXECUTE PROCEDURE targeting_weight_verification();
END;

END;
