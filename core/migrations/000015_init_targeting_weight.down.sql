BEGIN;

DELETE TRIGGER targeting_weight_verification_trigger;

DELETE FUNCTION targeting_weight_verification;

DELETE TABLE targeting_weight;

DELETE TYPE targeting_weight_type;

END;
