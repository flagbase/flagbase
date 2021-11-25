// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Flagbase',
  tagline: 'Flagbase Website Previewer',
  url: 'https://flagbase.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'assets/_common_/favicon.ico',
  organizationName: 'flagbase',
  projectName: 'flagbase',

  presets: [
    [
      '@docusaurus/preset-classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.docs.js'),
          editUrl: 'https://github.com/flagbase/flagbase/edit/master/www_v2/content/',
        },
        blog: {
          path: './blog',
          routeBasePath: '/',
          showReadingTime: true,
          editUrl:
            'https://github.com/flagbase/flagbase/edit/master/www_v2/content/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'dev',
        path: 'dev',
        routeBasePath: 'dev',
        sidebarPath: require.resolve('./sidebars.dev.js'),
      },
    ],
  ],


  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        logo: {
          alt: 'Flagbase Logo',
          src: 'assets/_common_/banner-dark.svg',
        },
        items: [
          {to: '/', label: 'Blog', position: 'left'},
          {
            type: 'doc',
            docId: 'intro/overview',
            position: 'left',
            label: 'Docs',
          },
          {
            type: 'doc',
            docsPluginId: 'dev',
            docId: 'intro/overview',
            position: 'left',
            label: 'Dev',
          },
          {
            href: 'https://github.com/flagbase/flagbase',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'light',
        copyright: `Copyleft (ɔ) ${new Date().getFullYear()} Flagbase.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
