BEGIN;
-- begin transaction --
CREATE EXTENSION "pgcrypto";


-- ------| Common Types and Domains |------ --
CREATE DOMAIN resource_key as VARCHAR(30) NOT NULL
  CHECK (value ~* '^[a-z0-9]+([_ -]?[a-z0-9])*$')
  CHECK (length(value) >= 4);
CREATE DOMAIN resource_name as VARCHAR(30);
CREATE DOMAIN resource_description as TEXT;
CREATE DOMAIN resource_tags as VARCHAR(30)[] NOT NULL DEFAULT '{}'::VARCHAR(30)[];


-- ------| WORKSPACE |------ --
CREATE TABLE workspace (
  id BIGSERIAL NOT NULL PRIMARY KEY,
  -- attributes
  key resource_key,
  name resource_name,
  description resource_description,
  tags resource_tags,
  -- contraints
  CONSTRAINT workspace_key UNIQUE(key)
);

-- ------| PROJECT |------ --
CREATE TABLE project (
  id BIGSERIAL NOT NULL PRIMARY KEY,
  -- references
  workspace_id BIGINT REFERENCES workspace (id),
  -- attributes
  key resource_key,
  name resource_name,
  description resource_description,
  tags resource_tags,
  -- contraints
  CONSTRAINT project_key UNIQUE(key, workspace_id)
);



-- ------| ENVIRONMENT |------ --
CREATE TABLE environment (
  id BIGSERIAL NOT NULL PRIMARY KEY,
  -- attributes
  key resource_key,
  name resource_name,
  description resource_description,
  tags resource_tags,
  -- references
  project_id BIGINT REFERENCES project (id),
  -- contraints
  CONSTRAINT environment_key UNIQUE(key, project_id)
);


-- ------| ACCESS |------ --
CREATE TYPE access_type AS ENUM (
  'root',   -- superuser (all workspaces)
  'admin',  -- superuser (per workspace)
  'user',   -- read + write
  'service' -- read
);

CREATE TABLE access (
  id BIGSERIAL NOT NULL PRIMARY KEY,
  -- attributes
  key UUID NOT NULL DEFAULT gen_random_uuid(),
  encrypted_secret TEXT,
  type access_type NOT NULL DEFAULT 'service',
  expires_at BIGINT NOT NULL DEFAULT 9223372036854775807,
  name resource_name,
  description resource_description,
  tags resource_tags
);

CREATE TABLE workspace_access (
  access_id BIGINT REFERENCES access (id),
  workspace_id BIGINT REFERENCES workspace (id)
);

CREATE TABLE project_access (
  access_id BIGINT REFERENCES access (id),
  project_id BIGINT REFERENCES workspace (id)
);

CREATE TABLE environment_access (
  access_id BIGINT REFERENCES access (id),
  environment_id BIGINT REFERENCES workspace (id)
);

-- verify access keys are only used one time on one resource
CREATE FUNCTION access_verification() RETURNS TRIGGER AS $$
BEGIN
    IF coalesce((select count(access_id) from workspace_access where access_id = NEW.access_id), 0) +
       coalesce((select count(access_id) from project_access where access_id = NEW.access_id), 0) +
       coalesce((select count(access_id) from environment_access where access_id = NEW.access_id), 0) >= 1 THEN
      RAISE EXCEPTION 'Access is already in use. Please create a new one or delete it from where it is being used.';
    END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER workspace_access_trigger
  BEFORE INSERT OR UPDATE
  ON workspace_access
  FOR EACH ROW EXECUTE PROCEDURE access_verification();
END;
CREATE TRIGGER project_access_trigger
  BEFORE INSERT OR UPDATE
  ON project_access
  FOR EACH ROW EXECUTE PROCEDURE access_verification();
END;
CREATE TRIGGER environment_access_trigger
  BEFORE INSERT OR UPDATE
  ON environment_access
  FOR EACH ROW EXECUTE PROCEDURE access_verification();
END;


-- ------| FLAG |------ --
CREATE TABLE flag (
  id BIGSERIAL NOT NULL PRIMARY KEY,
  -- attributes
  key resource_key,
  name resource_name,
  description resource_description,
  tags resource_tags,
  -- references
  project_id BIGINT REFERENCES project (id),
  -- contraints
  CONSTRAINT flag_key UNIQUE(key, project_id)
);

CREATE TABLE variation (
  id BIGSERIAL NOT NULL PRIMARY KEY,
  -- attributes
  key resource_key,
  name resource_name,
  description resource_description,
  tags resource_tags,
  -- references
  flag_id BIGINT REFERENCES flag (id),
  -- contraints
  CONSTRAINT variation_key UNIQUE(key, flag_id)
);


-- ------| SEGMENT |------ --
CREATE TABLE segment (
  id BIGSERIAL NOT NULL PRIMARY KEY,
  -- attributes
  key resource_key,
  name resource_name,
  description resource_description,
  tags resource_tags,
  -- references
  project_id BIGINT REFERENCES project (id),
  -- contraints
  CONSTRAINT segment_key UNIQUE(key, project_id)
);

CREATE TYPE segment_rule_condition AS ENUM (
  'equal',
  'greater_than',
  'greater_than_or_equal',
  'contains',
  'regex'
);

CREATE TABLE segment_rule (
  id BIGSERIAL NOT NULL PRIMARY KEY,
  -- attributes
  key resource_key,
  trait_key VARCHAR(40),
  condition segment_rule_condition,
  negate BOOLEAN DEFAULT FALSE,
  trait_value VARCHAR(40),
  -- references
  segment_id BIGINT REFERENCES segment (id),
  -- contraints
  CONSTRAINT segment_rule_key UNIQUE(key, segment_id)
);


-- ------| IDENTITY |------ --
CREATE DOMAIN identity_resource_key as VARCHAR(50) NOT NULL
  CHECK (value ~* '^[a-zA-Z0-9]*$');

CREATE TABLE identity (
  id BIGSERIAL NOT NULL PRIMARY KEY,
  -- attributes
  key identity_resource_key,
  traits JSONB,
  -- references
  environment_id BIGINT REFERENCES environment (id),
  -- contraints
  CONSTRAINT identity_key UNIQUE(key, environment_id)
);


-- ------| TARGETING |------ --
-- --------------------------
-- Simple Targeting Algorithm
-- --------------------------
-- state (on, off)
--  on ->
--    if rules exist  -> derive from targeting_rule
--    else            -> derive from targeting_percentages
--  off  ->  use fallback_variation
--
CREATE TYPE targeting_state AS ENUM (
  'on',
  'off'
);
CREATE TABLE targeting (
  id BIGSERIAL NOT NULL PRIMARY KEY,
  -- attributes
  state targeting_state,
  -- references
  fallback_variation_id BIGINT REFERENCES variation (id),
  flag_id BIGINT REFERENCES flag (id),
  environment_id BIGINT REFERENCES environment (id)
);

-- --------------------------
-- Targeting Rule Evaluation
-- --------------------------
-- <condition> (identity_id || segment_id) ==> <variation_id>
--
CREATE TYPE targeting_rule_type AS ENUM (
  'identity',
  'segment'
);
CREATE TYPE targeting_rule_condition AS ENUM (
  'include',
  'exclude'
);
CREATE TABLE targeting_rule (
  id BIGSERIAL NOT NULL PRIMARY KEY,
  -- attributes
  key resource_key,
  type targeting_rule_type,
  condition targeting_rule_condition,
  -- references
  identity_id BIGINT REFERENCES identity (id),
  segment_id BIGINT REFERENCES segment (id),
  variation_id BIGINT REFERENCES variation (id),
  targeting_id BIGINT REFERENCES targeting (id),
  -- contraints
  CONSTRAINT targeting_rule_key UNIQUE(key, targeting_id)
);

CREATE TABLE targeting_percentage (
  PRIMARY KEY (variation_id, targeting_id),
  -- attributes
  percentage INT,
  -- references
  variation_id BIGINT REFERENCES variation (id),
  targeting_id BIGINT REFERENCES targeting (id)
);

-- verify targeting percentage doesn't exceed 100
CREATE FUNCTION targeting_percentage_verification() RETURNS TRIGGER AS $$
BEGIN
    IF coalesce((select sum(percentage)
                from targeting_percentage
                where targeting_id = NEW.targeting_id), 0)
        + coalesce(NEW.percentage, 0) > 100 THEN
      RAISE EXCEPTION 'targeting_percentage % exceeds 100 percent', NEW.targeting_id;
    END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER targeting_percentage_verification_trigger
  BEFORE INSERT OR UPDATE
  ON targeting_percentage
  FOR EACH ROW EXECUTE PROCEDURE targeting_percentage_verification();
END;

-- ------| EVALUATION |------ --
CREATE TABLE evaluation (
  time BIGINT NOT NULL DEFAULT EXTRACT(EPOCH FROM NOW()) PRIMARY KEY,
  -- references
  variation_id BIGINT REFERENCES variation (id),
  targeting_id BIGINT REFERENCES targeting (id),
  identity_id BIGINT REFERENCES identity (id)
);


-- end transaction --
END;
