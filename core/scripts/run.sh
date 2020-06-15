#!/bin/bash
cd "$(dirname "$0")"
cd ..

# ------- Util Parameters ------- #
PROGNAME="$0"

# ------- DB Parameters ------- #

DB_HOST="${DB_HOST:-127.0.0.1}"
DB_PORT="${DB_PORT:-5432}"
DB_USER="${DB_USER:-flagbase}"
DB_PASSWORD="${DB_PASSWORD:-BjrvWmjQ3dykPu}"
DB_SSLMODE="${DB_SSLMODE:-disable}"
DB_NAME="${DB_NAME:-flagbase}"
DB_URL="postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?sslmode=${DB_SSLMODE}"

# ------- Helpers ------- #

function check_gomigrate() {
    command -v migrate >/dev/null 2>&1 || {
    echo >&2 "Migrate command not found. Have you installed golang-migrate?";
    echo >&2 "https://github.com/golang-migrate/migrate/blob/master/cmd/migrate/README.md#installation";
    exit 1;
  }
}

function check_air() {
    command -v air >/dev/null 2>&1 || {
    echo >&2 "Air command not found. Have you installed cosmtrek/air?";
    echo >&2 "https://github.com/cosmtrek/air#installation";
    exit 1;
  }
}

function check_psql() {
    command -v psql >/dev/null 2>&1 || {
    echo >&2 "Psql command not found. Have you installed psql?";
    echo >&2 "https://www.postgresql.org/download/";
    exit 1;
  }
}

function check_swagger() {
    command -v swagger >/dev/null 2>&1 || {
    echo >&2 "Swagger command not found. Have you installed goswagger?";
    echo >&2 "https://goswagger.io/install.html";
    exit 1;
  }
}

function pgexec() {
  check_psql
  PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_NAME -c "$1"
}

# ------- App Commands ------- #

function app_build() {
  go build -o ./bin/flagbased
}

function app_exec() {
  ./bin/flagbased $@
}

function app_run() {
  app_build
  app_exec $@
}

function app_dev() {
  air
}

# ------- DB Commands ------- #

function db_init() {
  psql -h $DB_HOST -p $DB_PORT -c "CREATE ROLE $DB_USER WITH LOGIN ENCRYPTED PASSWORD '$DB_PASSWORD';"
  psql -h $DB_HOST -p $DB_PORT -c "CREATE DATABASE $DB_NAME;"
  psql -h $DB_HOST -p $DB_PORT -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"
}

function db_drop() {
  psql -h $DB_HOST -p $DB_PORT -c "DROP DATABASE $DB_NAME;"
}


function db_migrate() {
  check_gomigrate
  migrate -path ./migrations -database $DB_URL up
}

function db_migrate_add() {
  if [[ -z "$1" ]]; then
    echo 1>&2 "Usage: ${PROGNAME} db:migrate:add <action_table>"
    echo 1>&2 ""
    echo 1>&2 "Error:"
    echo 1>&2 "   Please provide a name for this migration."
    exit 1
  fi
  check_gomigrate
  migrate create -ext sql -dir migrations -seq $1
  TEMPLATE='BEGIN;

  -- Add migration here.

  END;'
  for m in $(ls migrations | tail -n 2); do echo "$TEMPLATE" >> "migrations/$m"; done
}

function db_migrate_reset() {
  check_gomigrate
  migrate -path ./migrations -database $DB_URL down
}


function db_show() {
  pgexec "\dt;"
}


# ------- Swagger Commands ------- #

# function swagger_flatten {
#   check_swagger
#   swagger flatten ./api/swagger.yaml > ./generated/swagger.json
#   # cp generated/swagger.json ../website/static/docs/core/swagger.json
# }

function swagger_validate {
  check_swagger
  swagger validate ./api/swagger.yaml
}


function swagger_generate_models {
  check_swagger
  rm -rf ./generated/models/*
  swagger generate model -t ./generated -f ./api/swagger.yaml
}

function swagger_generate {
  check_swagger
  swagger_validate
  # swagger_flatten
  swagger_generate_models
}



# ------- Command Selector ------- #

function help() {
  echo 1>&2 "Usage: ${PROGNAME} <command>"
  echo 1>&2 ""
  echo 1>&2 "Commands:"
  echo 1>&2 "   app:build                 Build app and save binaries."
  echo 1>&2 "   app:exec                  Execute prebuilt binaries."
  echo 1>&2 "   app:run                   Build & execute binaries."
  echo 1>&2 "   app:dev                   Run app in development mode using cosmtrek/air."
  echo 1>&2 "   db:init                   Init postgres user & database."
  echo 1>&2 "   db:migrate                Run migrations on database."
  echo 1>&2 "   db:migrate:add            Add new migration file."
  echo 1>&2 "   db:migrate:reset          Roll back migrations."
  echo 1>&2 "   db:show                   Show db schemas."
  echo 1>&2 "   db:drop                   Drop database."
  # echo 1>&2 "   swagger:flatten           Flatten swagger specs."
  echo 1>&2 "   swagger:generate          Generate swagger files."
  echo 1>&2 "   swagger:generate:models   Generate swagger models."
  echo 1>&2 "   swagger:validate          Validates a swagger specification."
  echo 1>&2 ""
}

function run() {
  SUBCOMMAND="${1:-}"
  case "${SUBCOMMAND}" in
    "" | "help" | "-h" | "--help" )
      help
      ;;

    "app:build" )
      shift
      app_build "$@"
      ;;

    "app:exec" )
      shift
      app_exec "$@"
      ;;

    "app:run" )
      shift
      app_run "$@"
      ;;

    "app:dev" )
      shift
      app_dev "$@"
      ;;

    "db:init" )
      shift
      db_init "$@"
      ;;

    "db:migrate" )
      shift
      db_migrate "$@"
      ;;

    "db:migrate:add" )
      shift
      db_migrate_add "$@"
      ;;

    "db:migrate:reset" )
      shift
      db_migrate_reset "$@"
      ;;

    "db:show" )
      shift
      db_show "$@"
      ;;

    "db:drop" )
      shift
      db_drop "$@"
      ;;

    # "swagger:flatten" )
    #   shift
    #   swagger_flatten "$@"
    #   ;;

    "swagger:validate" )
      shift
      swagger_validate "$@"
      ;;

    "swagger:generate:models" )
      shift
      swagger_generate_models "$@"
      ;;

    "swagger:generate" )
      shift
      swagger_generate "$@"
      ;;

    *)
      help
      exit 1
      ;;
  esac
}

run $@
