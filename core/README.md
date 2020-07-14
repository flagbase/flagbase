# Core

## Getting Started
Initial database and run migrations.
```sh
./scripts/core.sh db:init
./scripts/core.sh db:migrate
```

Run using [air](https://github.com/cosmtrek/air), which reloads the app automatically on file changes.

```sh
./scripts/core.sh app:dev
```

Otherwise, you can manually build and run the app.
```sh
./scripts/core.sh app:build
./bin/flagbased <args>
```




