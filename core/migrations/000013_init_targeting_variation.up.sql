BEGIN;

CREATE TABLE targeting_variation (
  id resource_id_default PRIMARY KEY,
  -- attributes
  weight INT NOT NULL DEFAULT 100,
  -- references
  variation_id UUID REFERENCES variation (id) NOT NULL
  -- constraints
  CHECK (weight BETWEEN 0 AND 100)
);

END;
