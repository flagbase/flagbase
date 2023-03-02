package core

import "embed"

// We can get rid off this once this is fixed:
// https://github.com/golang/go/issues/41191#issuecomment-686616556
var (
	//go:embed migrations/*.sql
	MigrationsDir embed.FS
)
