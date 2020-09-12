BEGIN;

CREATE TABLE evaluation (
  time BIGINT NOT NULL DEFAULT EXTRACT(EPOCH FROM NOW()) PRIMARY KEY,
  -- references
  variation_id UUID NOT NULL REFERENCES variation (id),
  targeting_id UUID NOT NULL REFERENCES targeting (id),
  identity_id UUID NOT NULL REFERENCES identity (id)
);

END;
