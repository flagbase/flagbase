# Flagbase Core

## Documentation
TODO

## Setting up development
Initial database and run migrations.
```zsh
./scripts/run.sh db:init
./scripts/run.sh db:migrate
```

Run using [air](https://github.com/cosmtrek/air), which reloads the app automatically on file changes.

```zsh
./scripts/run.sh app:dev
```

```
Otherwise, you can manually build and run the app.
```zsh
./scripts/run.sh app:build
./bin/flagbased <args>
```




