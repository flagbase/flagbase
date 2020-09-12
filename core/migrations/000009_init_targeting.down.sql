BEGIN;

DELETE TRIGGER targeting_percentage_verification_trigger;
DELETE FUNCTION targeting_percentage_verification;
DELETE TABLE targeting_percentage;
DELETE TABLE targeting_rule;
DELETE TYPE targeting_rule_condition;
DELETE TYPE targeting_rule_type;
DELETE TABLE targeting;
DELETE TYPE targeting_state;

END;
