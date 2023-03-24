---
sidebar_position: 2
---

# JavaScript Client SDK

The Flagbase Javascript Client SDK, `@flagbase/js-client-sdk`, is a client-side library that allows developers to interact with Flagbase's API and manage feature flags in their web applications. The SDK is built using modern Javascript practices and tools, such as Webpack, Babel, and TypeScript.

## Getting Started

To start contributing to the Flagbase Javascript Client SDK, follow these steps:

1. Clone the repository
```sh
git clone git@github.com/flagbase/flagbase.git
cd sdk/js-client-sdk
```
2. Install the required dependencies by running `pnpm install`
3. Familiarize yourself with the SDK's structure and codebase

## Directory Structure

The SDK follows a standard directory structure:

- `dist/`: Contains the transpiled and bundled SDK for distribution
- `src/`: Contains the source code for the SDK
- `examples/`: Contains an example app, run via storybooks
- `.storybook/`: Contains the Storybook configuration and stories for UI components

## Scripts

The SDK includes several scripts in the `package.json` file to help streamline the development process:

- `build`: Transpiles and bundles the SDK using Webpack
- `test`: Runs the Jest test suite
- `storybook`: Starts the Storybook development server
- `build-storybook`: Builds a static version of the Storybook

To execute these scripts, use the `pnpm run <script-name>` command.

## Testing and Documentation

To ensure the stability and reliability of the SDK, thorough testing and documentation practices are required:

- Write unit tests for your changes using Jest
- Ensure existing tests pass and maintain code coverage
- Document any new features or changes to existing functionality
- Add or update Storybook stories for any UI components

## Submitting Changes

Once you have made your changes and tested them thoroughly, follow these steps to submit your changes:

1. Create a new branch based on the `master` branch, following the naming conventions from the [Flagbase Contribution Model](https://flagbase.com/dev/intro/workflow)
2. Commit your changes with clear and concise commit messages, referencing the relevant issue number
3. Push your branch to the remote repository
4. Submit a pull request to merge your branch into the `master` branch, referencing the issue number in the pull request description

By following these guidelines, you can contribute to the Flagbase Javascript Client SDK and help us build a powerful and easy-to-use SDK for managing feature flags in web applications. Thank you for your interest in contributing!