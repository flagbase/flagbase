BEGIN;

-- ------| EVALUATION |------ --
DELETE TABLE evaluation;

-- ------| TARGETING |------ --
DELETE TRIGGER targeting_percentage_verification_trigger;
DELETE FUNCTION targeting_percentage_verification;
DELETE TABLE targeting_percentage;
DELETE TABLE targeting_rule;
DELETE TYPE targeting_rule_condition;
DELETE TYPE targeting_rule_type;
DELETE TABLE targeting;
DELETE TYPE targeting_state;

-- ------| SEGMENT |------ --
DELETE TABLE identity;
DELETE TABLE segment_rule;
DELETE TYPE segment_rule_condition;
DELETE TABLE segment;

-- ------| FLAG |------ --
DELETE TABLE variation;
DELETE TABLE flag;

-- ------| RESOURCE ACCESS |------ --
DELETE TRIGGER environment_access_trigger;
DELETE TRIGGER project_access_trigger;
DELETE TRIGGER workspace_access_trigger;
DELETE FUNCTION access_verification;
DELETE TABLE environment_access;
DELETE TABLE project_access;
DELETE TABLE workspace_access;
DELETE TABLE access;
DELETE TYPE access_type;

-- ------| ENVIRONMENT |------ --
DELETE TABLE environment;

-- ------| PROJECT |------ --
DELETE TABLE project;

-- ------| WORKSPACE |------ --
DELETE TABLE workspace;

-- ------| Types and Domains |------ --
DELETE DOMAIN resource_key;
DELETE DOMAIN resource_name;
DELETE DOMAIN resource_description;
DELETE DOMAIN resource_tags;

-- ------| Extensions |------ --
DELETE EXTENSION "pgcrypto";

END;
