BEGIN;

CREATE DOMAIN identity_resource_key as VARCHAR(50) NOT NULL
  CHECK (value ~* '^[a-zA-Z0-9-]+$');

CREATE TABLE identity (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  -- attributes
  key identity_resource_key,
  -- references
  environment_id UUID NOT NULL REFERENCES environment (id),
  -- contraints
  CONSTRAINT identity_key UNIQUE(key, environment_id)
);

END;
