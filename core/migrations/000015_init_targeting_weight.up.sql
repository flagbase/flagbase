BEGIN;

-- --------------------------
-- Targeting Weights
-- --------------------------
-- type (fallthrough, rule)
--  fallthrough ->
--      % rollout ON targeting.fallthrough_variation
--  rule -> % rollout
--      % rollout ON targeting_rule.[targeting_rule_type].variation
--

CREATE TYPE targeting_weight_type AS ENUM (
  'fallthrough',
  'rule'
);

CREATE TABLE targeting_weight (
  PRIMARY KEY (targeting_id, targeting_rule_id, variation_id),
  -- attributes
  type targeting_weight_type NOT NULL,
  weight INT NOT NULL,
  -- references
  targeting_id UUID REFERENCES targeting (id),
  targeting_rule_id UUID REFERENCES targeting_rule (id),
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
          type = NEW.type AND (
            targeting_id = NEW.targeting_id OR
            targeting_rule_id = NEW.targeting_rule_id
          )
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
