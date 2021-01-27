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

CREATE TABLE targeting_rule_weight (
  PRIMARY KEY (targeting_rule_id, variation_id),
  -- attributes
  weight INT NOT NULL DEFAULT 0,
  -- references
  targeting_rule_id UUID REFERENCES targeting_rule (id),
  variation_id UUID REFERENCES variation (id) -- variation that is being targeted
);

-- verify targeting weight doesn't exceed 100
CREATE FUNCTION targeting_rule_weight_verification() RETURNS TRIGGER AS $$
BEGIN
    IF coalesce(
      (select sum(weight)
        from
          targeting_rule_weight
        where
          type = NEW.type AND targeting_rule_id = NEW.targeting_rule_id
      ), 0) + coalesce(NEW.weight, 0) > 100 THEN
      RAISE EXCEPTION 'targeting_rule_weight aggregation exceeds 100%', NEW.targeting_id;
    END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER targeting_rule_weight_verification_trigger
  BEFORE INSERT OR UPDATE
  ON targeting_rule_weight
  FOR EACH ROW EXECUTE PROCEDURE targeting_rule_weight_verification();
END;

END;
