BEGIN;

-- trait keys have to be camel-case
CREATE DOMAIN trait_resource_key as VARCHAR(50) NOT NULL
  CHECK (value ~* '([a-z0-9]+|[A-Z0-9]+[a-z0-9]*|[A-Z0-9][a-z0-9]*([A-Z0-9][a-z0-9]*)*)');

CREATE TABLE trait (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  -- attributes
  key trait_resource_key,
  is_identifier BOOLEAN DEFAULT FALSE,
  -- references
  environment_id UUID NOT NULL REFERENCES environment (id),
  -- contraints
  CONSTRAINT trait_key UNIQUE(key, environment_id)
);

END;
