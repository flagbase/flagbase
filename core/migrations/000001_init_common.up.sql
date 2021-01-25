BEGIN;

CREATE EXTENSION "pgcrypto";

CREATE DOMAIN resource_id as UUID NOT NULL;

CREATE DOMAIN resource_id_default as resource_id DEFAULT gen_random_uuid();

CREATE DOMAIN resource_key as VARCHAR(30) NOT NULL
  CHECK (value ~* '^[a-z0-9]+([_ -]?[a-z0-9])*$')
  CHECK (length(value) >= 4);

CREATE DOMAIN resource_name as VARCHAR(30);

CREATE DOMAIN resource_description as TEXT;

CREATE DOMAIN resource_tags as VARCHAR(30)[] NOT NULL DEFAULT '{}'::VARCHAR(30)[];

END;
