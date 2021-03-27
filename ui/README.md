# ui

This folder contains everything that makes up [Flagbase UI](https://flagbase.com/dev/ui/getting-started). It contains reusable UI components and app-specific code.

## Directories
* **components**: dumb UI components (purely functional)
* **app**: where app specific code sits
  * **containers**: UI components connected to state / API
  * **pages**: composition of containers / components that make up a page
* **electron**: electron related setup files
* **webpack**: webpack related configuration files

## Quick Start

### Installation
```bash
npm install
```

### Usage
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

### Storybooks
Run storybook locally using:

```bash
npm run storybook
```

You can view it here: [http://localhost:6006/](http://localhost:6006/)


### Packaging
To generate a project package run `package`

```bash
npm run package
```

## Contributing
We encourage community contributions via pull requests. Before contributing, please checkout our [guidelines](https://flagbase.com/dev/intro/workflow#contributing) for instructions on how to contribute to flagbase.

## Resources
Check out these pages that'll help you get started, if you want to contribute to the UI:
* [UI Dev Guides](https://flagbase.com/dev/ui/getting-started): Building & running locally / Architecture etc
* [UI RFCs](https://flagbase.atlassian.net/wiki/spaces/OSS/pages/695566385/UI+-+RFCs): Technical RFCs / Proposals etc
