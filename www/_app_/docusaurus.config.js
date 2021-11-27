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
          path: 'docs',
          routeBasePath: '/docs',
          sidebarPath: require.resolve('./sidebars.docs.js'),
          editUrl: 'https://github.com/flagbase/flagbase/edit/master/www/content/',
          // This allows us to override sidebar items in order to add custom links
          sidebarItemsGenerator: async function ({
            defaultSidebarItemsGenerator,
            ...args
          }) {
            const sidebarItems = await defaultSidebarItemsGenerator(args);
            const newSidebarItems = []
            for (const sidebarItem of sidebarItems) {
              var newSidebarItem = {...sidebarItem}
              if (newSidebarItem.label === 'Core') {
                newSidebarItem.items.push({
                  type: "link",
                  href: "/docs/core/api",
                  label: "API Docs"
                })
              }
              newSidebarItems.push(newSidebarItem)
            }
            return sidebarItems;
          },
        },
        blog: {
          path: './blog',
          routeBasePath: '/',
          showReadingTime: true,
          editUrl:
            'https://github.com/flagbase/flagbase/edit/master/www/content/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
    [
      'redocusaurus',
      {
        specs: [{
          routePath: '/docs/core/api',
          specUrl: '/swagger.yaml',
        }],
        theme: {
          primaryColor: '#0b58a5',
          // https://github.com/redocly/redoc#redoc-options-object
        },
      }
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
        editUrl: 'https://github.com/flagbase/flagbase/edit/master/www/content/'
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
            to: "/docs/core/api",
            label: "API"
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
        copyright: `Copyleft (ɔ) ${new Date().getFullYear()} Flagbase. This is just a preview of flagbase.com`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
