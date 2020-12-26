BEGIN;

-- --------------------------
-- Simple Targeting Algorithm
-- --------------------------
-- state (on, off)
--  on ->
--    if rules exist  -> derive from targeting_rule
--    else            -> derive from targeting_weights
--  off  ->  use fallthrough_variation
--
CREATE TYPE targeting_state AS ENUM (
  'on',
  'off'
);
CREATE TABLE targeting (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  -- attributes
  state targeting_state,
  -- references
  fallthrough_variation_id UUID REFERENCES variation (id),
  flag_id UUID REFERENCES flag (id),
  environment_id UUID REFERENCES environment (id)
);

-- --------------------------
-- Targeting Rule Evaluation
-- --------------------------
-- <condition> (identity_id || segment_id) ==> <variation_id>
--
CREATE TYPE targeting_rule_type AS ENUM (
  'identity',
  'segment'
);
CREATE TYPE targeting_rule_condition AS ENUM (
  'include',
  'exclude'
);
CREATE TABLE targeting_rule (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  -- attributes
  key resource_key,
  type targeting_rule_type,
  condition targeting_rule_condition,
  -- references
  identity_id UUID REFERENCES identity (id),
  segment_id UUID REFERENCES segment (id),
  variation_id UUID REFERENCES variation (id),
  targeting_id UUID REFERENCES targeting (id),
  -- contraints
  CONSTRAINT targeting_rule_key UNIQUE(key, targeting_id)
);

CREATE TABLE targeting_weight (
  PRIMARY KEY (variation_id, targeting_id),
  -- attributes
  weight INT,
  -- references
  variation_id UUID REFERENCES variation (id),
  targeting_id UUID REFERENCES targeting (id)
);

-- verify targeting weight doesn't exceed 100
CREATE FUNCTION targeting_weight_verification() RETURNS TRIGGER AS $$
BEGIN
    IF coalesce((select sum(weight)
                from targeting_weight
                where targeting_id = NEW.targeting_id), 0)
        + coalesce(NEW.weight, 0) > 100 THEN
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
