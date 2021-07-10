BEGIN;

CREATE DOMAIN identity_resource_key as VARCHAR(50) NOT NULL
  CHECK (value ~* '^[a-zA-Z0-9-]+$');

CREATE TABLE identity (
  id resource_id_default PRIMARY KEY,
  -- attributes
  key identity_resource_key,
  -- references
  environment_id resource_id REFERENCES environment (id) ON DELETE CASCADE ON UPDATE CASCADE,
  -- contraints
  CONSTRAINT identity_key UNIQUE(key, environment_id)
);

END;
