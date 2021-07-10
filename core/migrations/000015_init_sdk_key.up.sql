BEGIN;

CREATE TABLE sdk_key (
  id resource_id_default PRIMARY KEY,
  -- attributes
  enabled BOOLEAN DEFAULT TRUE NOT NULL,
  client_key TEXT DEFAULT 'sdk-client_'|| gen_random_uuid(),
  server_key TEXT DEFAULT 'sdk-server_'|| gen_random_uuid(),
  expires_at BIGINT NOT NULL DEFAULT 9223372036854775807,
  -- meta-data
  name resource_name,
  description resource_description,
  tags resource_tags,
  -- references
  environment_id resource_id REFERENCES environment (id) ON DELETE CASCADE ON UPDATE CASCADE NOT NULL,
  -- contraints
  CONSTRAINT sdk_server_key UNIQUE(server_key),
  CONSTRAINT sdk_client_key UNIQUE(client_key)
);

END;
