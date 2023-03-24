---
sidebar_position: 3
---

# React Client SDK

Welcome to the contribution guide for the Flagbase React Client SDK! This SDK enables developers to integrate Flagbase with their React applications easily. This page provides an overview of the SDK, its structure, and guidelines for contributing.

## Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Directory Structure](#directory-structure)
4. [Scripts](#scripts)
5. [Testing and Documentation](#testing-and-documentation)
6. [Submitting Changes](#submitting-changes)

## Introduction

The Flagbase React Client SDK, `@flagbase/react-client-sdk`, is a client-side library that allows developers to interact with Flagbase's API and manage feature flags in their React applications. The SDK is built using modern Javascript practices and tools, such as Parcel, TypeScript, and React.

## Getting Started

To start contributing to the Flagbase React Client SDK, follow these steps:

1. Clone the repository
```sh
git clone git@github.com/flagbase/flagbase.git
cd sdk/react-client-sdk
```
2. Install the required dependencies by running `pnpm install`
3. Familiarize yourself with the SDK's structure and codebase

## Directory Structure

The SDK follows a standard directory structure:

- `dist/`: Contains the transpiled and bundled SDK for distribution
- `src/`: Contains the source code for the SDK

## Scripts

The SDK includes several scripts in the `package.json` file to help streamline the development process:

- `dev`: Starts the Parcel development server and watches for changes
- `build`: Transpiles and bundles the SDK using Parcel

To execute these scripts, use the `pnpm run <script-name>` command.

## Testing and Documentation

To ensure the stability and reliability of the SDK, thorough testing and documentation practices are required:

- Write unit tests for your changes using an appropriate React testing library (e.g., React Testing Library or Enzyme)
- Ensure existing tests pass and maintain code coverage
- Document any new features or changes to existing functionality

## Submitting Changes

Once you have made your changes and tested them thoroughly, follow these steps to submit your changes:

1. Create a new branch based on the `master` branch, following the naming conventions from the [Flagbase Contribution Model](https://flagbase.com/dev/intro/workflow)
2. Commit your changes with clear and concise commit messages, referencing the relevant issue number
3. Push your branch to the remote repository
4. Submit a pull request to merge your branch into the `master` branch, referencing the issue number in the pull request description

By following these guidelines, you can contribute to the Flagbase React Client SDK and help us build a powerful and easy-to-use SDK for managing feature flags in React applications. Thank you for your interest in contributing!