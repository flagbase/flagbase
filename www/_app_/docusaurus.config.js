const path = require("path");

module.exports = {
  title: "Flagbase",
  tagline: "Flagbase is a high-performance feature management service.",
  url: "https://flagbase.com",
  baseUrl: "/",
  organizationName: "flagbase",
  favicon: "favicon.ico",
  projectName: "flagbase",
  themeConfig: {
    disableDarkMode: true,
    navbar: {
      hideOnScroll: true,
      links: [
        {
          to: "/",
          activeBasePath: "blog",
          label: "Blog",
          position: "left",
        },
        {
          to: "/dev",
          activeBasePath: "dev",
          label: "Dev",
          position: "left",
        },
        {
          to: "/docs",
          activeBasePath: "docs",
          label: "Docs",
          position: "left",
        },
      ],
    },
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          path: "./docs",
          routeBasePath: "docs",
          homePageId: "intro/overview",
          sidebarPath: require.resolve("./sidebars.docs.js"),
          showLastUpdateTime: true,
        },
        blog: {
          path: "./blog",
          routeBasePath: "/",
          showReadingTime: true,
          postsPerPage: 10,
        },
      },
    ],
  ],
  plugins: [
    [
      require.resolve("@docusaurus/plugin-content-docs"),
      {
        path: "./dev",
        routeBasePath: "dev",
        homePageId: "development/overview",
        include: ["**/*.md", "**/*.mdx"],
        sidebarPath: require.resolve("./sidebars.dev.js"),
        showLastUpdateTime: true,
      },
    ],
    [
      "docusaurus-plugin-auto-sidebars",
      {
        path: "./docs",
        sidebarPath: "sidebars.docs.auto.js",
      },
    ],
    [
      "docusaurus-plugin-auto-sidebars",
      {
        path: "./dev",
        sidebarPath: "sidebars.dev.auto.js",
      },
    ],
  ],
};
