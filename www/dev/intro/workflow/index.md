---
sidebar_position: 2
---

# Workflow

This page provides a detailed overview of our contribution workflow, including tagging pull requests, commits, branches, and integrating with external tools like GitHub Issues and Jira. By following these guidelines, we can maintain a consistent and efficient contribution process.

## Table of Contents

1. [Introduction](#introduction)
2. [Issue Tracking](#issue-tracking)
3. [Branching Strategy](#branching-strategy)
4. [Commit and Pull Request Guidelines](#commit-and-pull-request-guidelines)
5. [Integration with GitHub Issues and Jira](#integration-with-github-issues-and-jira)

## Introduction

The Flagbase Contribution Model is designed to streamline our development process and ensure that all contributions are organized and easy to manage. By adhering to these guidelines, we can maintain high-quality code and continue to build a robust flag management platform.

## Issue Tracking

Before starting any development work, create an issue in our issue tracking system (either GitHub Issues or Jira). This will allow us to discuss the proposed changes, prioritize work, and assign tasks to contributors.

Issues should include:

- A descriptive title
- A clear and concise explanation of the problem or feature request
- Any relevant supporting information (e.g., screenshots, logs, etc.)

## Branching Strategy

Our branching strategy is based on the [Gitflow Workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow). We maintain two primary branches:

- `release`: This branch contains the stable, production-ready code.
- `master`: This branch serves as an integration branch for new features and bugfixes.

When working on a new feature or bugfix, create a new branch based on the `master` branch. Use the following naming conventions for your branches:

- For features: `feature/issue-<issue_number>-short-description`
- For bugfixes: `bugfix/issue-<issue_number>-short-description`

Once your changes are ready for review, submit a pull request to merge your branch into the `master` branch.

## Commit and Pull Request Guidelines

Follow these guidelines when creating commits and pull requests:

1. Write clear and concise commit messages that describe the changes you made.
2. Reference the issue number in your commit messages by adding `#<issue_number>` at the end of the message.
3. Keep your pull requests focused and limited to a single issue.
4. Provide a descriptive title for your pull request and include a summary of the changes made.
5. In the pull request description, add a reference to the issue using `Closes #<issue_number>` or `Fixes #<issue_number>` to automatically link the pull request to the issue.

## Integration with GitHub Issues and Jira

Our contribution model integrates seamlessly with both GitHub Issues and Jira. When creating issues, commits, or pull requests, use the relevant issue number from the respective issue tracking system.

For GitHub Issues:

- Reference the issue in your commit message with `#<issue_number>`
- Reference the issue in your pull request description with `Closes #<issue_number>` or `Fixes #<issue_number>`

For Jira:

- Reference the issue in your commit message with the issue key (e.g., `OSS-<issue_number>`)
- Reference the issue in your pull request description with the issue key (e.g., `OSS-<issue_number>`)

By following these guidelines, we can maintain a consistent and efficient contribution model for the Flagbase project. Thank you for your interest in contributing and helping us build a better flag management platform!

Check out our Jira issues here: [https://flagbase.atlassian.net/jira/software/c/projects/OSS/issues/](https://flagbase.atlassian.net/jira/software/c/projects/OSS/issues/)