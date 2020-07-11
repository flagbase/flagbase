# Core

## Getting Started
Initial database and run migrations.
```sh
./tools/core.sh db:init
./tools/core.sh db:migrate
```

Run using [air](https://github.com/cosmtrek/air), which reloads the app automatically on file changes.

```sh
./tools/core.sh app:dev
```

Otherwise, you can manually build and run the app.
```sh
./tools/core.sh app:build
./bin/flagbased <args>
```




