# www

**[Flagbase.com](https://flagbase.com)** is built using [Docusaurus](https://docusaurus.io/).

## Project structure

- `blog`: This directory contains all the blog posts for flagbase. Each blog post is in its own directory and the authors.yml file likely contains information about the authors of the posts.
- `dev`: This directory contains development-related documents or scripts, categorized into core, intro, sdk, and ui.
- `docs`: This directory contains the user-facing documentation for flagbase. It's divided into core, guides, intro, and sdk.
- `src`: This directory contains the source code for your project. It's divided into components (React components), css (stylesheets), pages (the pages of your website), and utils (utility functions).
- `static`: This directory contains static files that are copied into the root of the build directory.

### Installation

```
$ pnpm i
```

### Local Development

```
$ pnpm start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

```
$ pnpm build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.
