BEGIN;

-- Add new fields to targeting_rule:
--  * enabled: status of the targeting rule
--  * effective_start_timestamp: unix timestamp indicating when the targeting rule is effective from
--  * effective_end_timestamp: unix timestamp indicating when the targeting rule is effective to
ALTER TABLE targeting_rule
ADD COLUMN enabled BOOLEAN NOT NULL DEFAULT TRUE,
ADD COLUMN effective_start_timestamp INT NOT NULL DEFAULT 0,
ADD COLUMN effective_end_timestamp INT NOT NULL DEFAULT 9223372036854775807;

END;
