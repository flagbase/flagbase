BEGIN;

DELETE TRIGGER targeting_weight_verification_trigger;

DELETE FUNCTION targeting_weight_verification;

DELETE FUNCTION targeting_weight;

DELETE TABLE targeting;

END;
