BEGIN;

CREATE TYPE access_type AS ENUM (
  'root',   -- superuser (all workspaces)
  'admin',  -- superuser (per workspace)
  'user',   -- read + write
  'service' -- read
);

CREATE TABLE access (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  -- attributes
  key TEXT,
  encrypted_secret TEXT,
  type access_type NOT NULL DEFAULT 'service',
  expires_at BIGINT NOT NULL DEFAULT 9223372036854775807,
  name resource_name,
  description resource_description,
  tags resource_tags,
  -- contraints
  CONSTRAINT access_key UNIQUE(key)
);

END;
