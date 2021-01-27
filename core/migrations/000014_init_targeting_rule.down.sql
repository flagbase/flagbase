BEGIN;

DELETE TRIGGER targeting_rule_weight_verification_trigger;

DELETE FUNCTION targeting_rule_weight_verification;

DELETE TABLE targeting_rule_weight;

DELETE TABLE targeting_rule;

DELETE TYPE targeting_rule_type;

END;
