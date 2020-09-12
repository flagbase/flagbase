BEGIN;

CREATE TABLE evaluation (
  time BIGINT NOT NULL DEFAULT EXTRACT(EPOCH FROM NOW()) PRIMARY KEY,
  -- references
  variation_id UUID REFERENCES variation (id),
  targeting_id UUID REFERENCES targeting (id),
  identity_id UUID REFERENCES identity (id)
);

END;
