BEGIN;
-- begin transaction --
CREATE EXTENSION "pgcrypto";


-- ------| Common Types and Domains |------ --
CREATE DOMAIN resource_id as UUID NOT NULL DEFAULT gen_random_uuid();
CREATE DOMAIN resource_key as VARCHAR(30) NOT NULL
  CHECK (value ~* '^[a-z0-9]+([_ -]?[a-z0-9])*$')
  CHECK (length(value) >= 4);
CREATE DOMAIN resource_name as VARCHAR(30);
CREATE DOMAIN resource_description as TEXT;
CREATE DOMAIN resource_tags as VARCHAR(30)[] NOT NULL DEFAULT '{}'::VARCHAR(30)[];

-- ------| WORKSPACE |------ --
CREATE TABLE workspace (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
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
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  -- references
  workspace_id UUID REFERENCES workspace (id),
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
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  -- attributes
  key resource_key,
  name resource_name,
  description resource_description,
  tags resource_tags,
  -- references
  project_id UUID REFERENCES project (id),
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
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
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


-- ------| FLAG |------ --
CREATE TABLE flag (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  -- attributes
  key resource_key,
  name resource_name,
  description resource_description,
  tags resource_tags,
  -- references
  project_id UUID REFERENCES project (id),
  -- contraints
  CONSTRAINT flag_key UNIQUE(key, project_id)
);

CREATE TABLE variation (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  -- attributes
  key resource_key,
  name resource_name,
  description resource_description,
  tags resource_tags,
  -- references
  flag_id UUID REFERENCES flag (id),
  -- contraints
  CONSTRAINT variation_key UNIQUE(key, flag_id)
);


-- ------| SEGMENT |------ --
CREATE TABLE segment (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  -- attributes
  key resource_key,
  name resource_name,
  description resource_description,
  tags resource_tags,
  -- references
  project_id UUID REFERENCES project (id),
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
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  -- attributes
  key resource_key,
  trait_key VARCHAR(40),
  condition segment_rule_condition,
  negate BOOLEAN DEFAULT FALSE,
  trait_value VARCHAR(40),
  -- references
  segment_id UUID REFERENCES segment (id),
  -- contraints
  CONSTRAINT segment_rule_key UNIQUE(key, segment_id)
);


-- ------| IDENTITY |------ --
CREATE DOMAIN identity_resource_key as VARCHAR(50) NOT NULL
  CHECK (value ~* '^[a-zA-Z0-9]*$');

CREATE TABLE identity (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  -- attributes
  key identity_resource_key,
  traits JSONB,
  -- references
  environment_id UUID REFERENCES environment (id),
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
--  off  ->  use fallthrough_variation
--
CREATE TYPE targeting_state AS ENUM (
  'on',
  'off'
);
CREATE TABLE targeting (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  -- attributes
  state targeting_state,
  -- references
  fallthrough_variation_id UUID REFERENCES variation (id),
  flag_id UUID REFERENCES flag (id),
  environment_id UUID REFERENCES environment (id)
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
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  -- attributes
  key resource_key,
  type targeting_rule_type,
  condition targeting_rule_condition,
  -- references
  identity_id UUID REFERENCES identity (id),
  segment_id UUID REFERENCES segment (id),
  variation_id UUID REFERENCES variation (id),
  targeting_id UUID REFERENCES targeting (id),
  -- contraints
  CONSTRAINT targeting_rule_key UNIQUE(key, targeting_id)
);

CREATE TABLE targeting_percentage (
  PRIMARY KEY (variation_id, targeting_id),
  -- attributes
  percentage INT,
  -- references
  variation_id UUID REFERENCES variation (id),
  targeting_id UUID REFERENCES targeting (id)
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
  variation_id UUID REFERENCES variation (id),
  targeting_id UUID REFERENCES targeting (id),
  identity_id UUID REFERENCES identity (id)
);


-- end transaction --
END;
