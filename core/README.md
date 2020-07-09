# Core

## Documentation
TODO

## Setting up development
Initial database and run migrations.
```zsh
./tools/core.sh db:init
./tools/core.sh db:migrate
```

Run using [air](https://github.com/cosmtrek/air), which reloads the app automatically on file changes.

```zsh
./tools/core.sh app:dev
```

```
Otherwise, you can manually build and run the app.
```zsh
./tools/core.sh app:build
./bin/flagbased <args>
```




