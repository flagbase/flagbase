BEGIN;

CREATE TABLE evaluation (
  time BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()) PRIMARY KEY,
  -- references
  variation_id resource_id REFERENCES variation (id) ON DELETE NO ACTION ON UPDATE NO ACTION,
  targeting_id resource_id REFERENCES targeting (id) ON DELETE NO ACTION ON UPDATE NO ACTION,
  identity_id resource_id REFERENCES identity (id) ON DELETE NO ACTION ON UPDATE NO ACTION
);

END;
