import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Flagbase',
  tagline: 'Flagbase is a high-performance feature management service',
  favicon: 'site/common/favicon.ico',

  // Set the production url of your site here
  url: 'https://flagbase.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'flagbase', // Usually your GitHub org/user name.
  projectName: 'flagbase', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/flagbase/flagbase/tree/main/www/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/flagbase/flagbase/tree/main/www/',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
    [
      'redocusaurus',
      {
        specs: [{
          route: '/docs/core/api',
          spec: '../core/api/swagger/swagger.yaml',
        }],
        theme: {
          primaryColor: '#0b58a5',
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
        sidebarPath: require.resolve('./sidebars.ts')
      },
    ]
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'site/common/social-banner.png',
    colorMode: {
      disableSwitch: true,
      defaultMode: 'light',
      respectPrefersColorScheme: false
    },
    navbar: {
      style: 'dark',
      logo: {
        alt: 'Flagbase Logo',
        src: 'site/common/banner-light.svg',
      },
      items: [
        {
          label: "Why Flagbase",
          to: "/",
          position: "left",
          items: [
            {
              to: "/docs/intro/overview",
              activeBaseRegex: "/docs/intro/overview",
              label: "Overview",
            },
            {
              to: "/docs/intro/features",
              activeBaseRegex: "/docs/intro/features",
              label: "Features",
            },
            {
              to: "/docs/intro/use-cases",
              activeBaseRegex: "/docs/intro/use-cases",
              label: "Use Cases",
            }
          ],
        },
        {
          label: "Open Source",
          position: "left",
          to: "/oss",
          horizontal: true,
          items: [
            {
              to: "/oss#core",
              activeBaseRegex: "oss#core",
              label: "Core"
            },
            {
              to: "/oss#sdk",
              activeBaseRegex: "oss#sdk",
              label: "SDK"
            },
            {
              to: "/oss#ui",
              activeBaseRegex: "oss#ui",
              label: "Client"
            },
          ],
        },
        {
          label: "Community",
          position: "left",
          to: "/community",
          horizontal: true,
          items: [
            {
              href: "https://github.com/flagbase/flagbase",
              label: "Github"
            },
            {
              href: "https://github.com/flagbase/flagbase/discussions",
              label: "Dicussions"
            },
          ],
        },
        {
          to: "/docs/guides/overview",
          activeBasePath: "docs",
          label: "Docs",
          position: "left",
          items: [
            {
              label: "Guides",
              activeBaseRegex: "/docs/guides/overview",
              to: "docs/guides/overview",
            },
            {
              label: "SDK Docs",
              activeBaseRegex: "/docs/sdk/overview",
              to: "docs/sdk/overview",
            },
            {
              label: "API Docs",
              activeBaseRegex: "/docs/core/api",
              to: "docs/core/api",
            },
          ],
        },
        {
          href: 'https://client.flagbase.com',
          label: 'Connect to an Instance',
          position: 'right',
          target: '_blank',
        }
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Open-source',
          items: [
            {
              label: 'Components',
              to: '/oss',
            },
            {
              label: 'Source code',
              href: 'http://github.com/flagbase/flagbase',
            },
            {
              label: 'Discussions',
              href: 'https://github.com/flagbase/flagbase/discussions',
            }
          ],
        },
        {
          title: 'Documentation',
          items: [
            {
              label: 'Guides',
              to: 'docs/guides/overview',
            },
            {
              label: 'SDK Docs',
              to: 'docs/sdk/overview',
            },
            {
              label: 'API Docs',
              to: 'docs/core/api',
            },
          ],
        },
        {
          title: 'Development',
          items: [
            {
              to: '/dev/intro/overview',
              label: 'Overview',
            },
            {
              to: '/dev/intro/workflow#project-management',
              label: 'Management',
            },
            {
              to: '/dev/intro/workflow#contributing',
              label: 'Contributing',
            },
          ],
        },
        {
          title: 'Organisation',
          items: [
            {
              label: 'About',
              to: 'about',
            },
            {
              label: 'Blog',
              to: 'blog',
            },
            {
              to: '/community',
              label: 'Community',
            },
          ],
        },
      ],
      logo: {
        src: 'site/common/banner-light.svg',
        alt: 'Flagbase',
        href: '/',
      },
      copyright: `
      <p>
        <span class='copyright_text'><span class='copyleft'>&copy;</span> ${new Date().getFullYear()} Flagbase</span>
        <a class='footer_link' href='/legal/license'>License</a>
        <a class='footer_link' href='/legal/cla'>CLA</a>
        <a class='footer_link' href='/legal/privacy'>Privacy</a>
      </p>
      `,
    },
    prism: {
      theme: prismThemes.vsLight,
      darkTheme: prismThemes.vsDark,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
