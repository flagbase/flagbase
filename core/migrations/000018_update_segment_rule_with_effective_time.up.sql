BEGIN;

-- Add new fields to segment_rule:
--  * enabled: status of the segment rule
--  * effective_start_timestamp: unix timestamp indicating when the segment rule is effective from
--  * effective_end_timestamp: unix timestamp indicating when the segment rule is effective to
ALTER TABLE segment_rule
ADD COLUMN enabled BOOLEAN NOT NULL DEFAULT TRUE,
ADD COLUMN effective_start_timestamp INT NOT NULL DEFAULT 0,
ADD COLUMN effective_end_timestamp INT NOT NULL DEFAULT 9223372036854775807;

END;
