BEGIN;

CREATE TABLE evaluation (
  time BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()) PRIMARY KEY,
  -- references
  variation_id resource_id REFERENCES variation (id),
  targeting_id resource_id REFERENCES targeting (id),
  identity_id resource_id REFERENCES identity (id)
);

END;
