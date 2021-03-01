# Flagbase UI

This folder contains everything that makes up Flagbase UI. It contains reusable UI components and app-specific code.

## Directories
* **components**: dumb UI components (purely functional)
* **app**: where app specific code sits
  * **containers**: UI components connected to state / API
  * **pages**: composition of containers / components that make up a page
* **electron**: electron related setup files
* **webpack**: webpack related configuration files

# Installation
```bash
npm install
```

## Usage
In order to run this project 2 scripts will need to be executed `dev:react` and `dev:electron`, run each one in a different terminal and always run `dev:react` before `dev:electron`, or `dev` to run them in order automatically

```bash
npm run dev:react
```
```bash
npm run dev:electron
```

or

```bash
npm run dev
```

## Packaging
To generate a project package run `package`

```bash
npm run package
```
