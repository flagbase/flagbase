package migrate

import (
	"core"
	"database/sql"
	"fmt"
	"log"

	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/postgres"
	"github.com/golang-migrate/migrate/v4/source/iofs"
	_ "github.com/lib/pq"
)

// Migrate runs the migrations on the provided database URL using the migrations embedded in the given directory.
func Migrate(dbURL string, isUpwards bool) error {
	log.Printf("running migrations...")

	db, err := sql.Open("postgres", dbURL)
	if err != nil {
		return fmt.Errorf("failed to create database instance: %w", err)
	}

	err = db.Ping()
	if err != nil {
		return fmt.Errorf("failed to connect to database: %w", err)
	}

	dbDriver, err := postgres.WithInstance(db, &postgres.Config{})
	if err != nil {
		return fmt.Errorf("failed to create database driver: %w", err)
	}

	sourceInstance, err := iofs.New(core.MigrationsDir, "migrations")
	if err != nil {
		return fmt.Errorf("failed to create source instance: %w", err)
	}

	m, err := migrate.NewWithInstance("iofs", sourceInstance, "postgres", dbDriver)
	if err != nil {
		return fmt.Errorf("failed to create migration instance: %w", err)
	}

	if isUpwards {
		err = m.Up()
		if err != nil && err != migrate.ErrNoChange {
			return fmt.Errorf("failed to apply upward migrations: %w", err)
		}
	} else {
		err = m.Down()
		if err != nil && err != migrate.ErrNoChange {
			return fmt.Errorf("failed to apply downward migrations: %w", err)
		}
	}

	log.Printf("Migrations applied successfully.")
	return nil
}
