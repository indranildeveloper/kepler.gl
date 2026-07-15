import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const websiteBaseUrl = process.env.WEBSITE_BASE_URL || '/';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'kepler.gl',
  tagline:
    'Kepler.gl is a powerful open source geospatial analysis tool for large-scale data sets.',
  favicon: 'img/favicon.png',
  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true // Improve compatibility with the upcoming Docusaurus v4
  },
  url: 'https://kepler.gl',
  baseUrl: websiteBaseUrl,
  organizationName: 'keplergl', // Usually your GitHub org/user name.
  projectName: 'kepler.gl', // Usually your repo name.
  onBrokenLinks: 'throw',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn'
    }
  },
  trailingSlash: false,
  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en']
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
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/'
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn'
        },
        theme: {
          customCss: './src/css/custom.css'
        }
      } satisfies Preset.Options
    ]
  ],

  themeConfig: {
    // Replace with your project's social card
    image: '/img/kepler-gl-social-card-image.png',
    colorMode: {
      respectPrefersColorScheme: true
    },
    navbar: {
      title: 'Kepler.gl',
      logo: {
        alt: 'Kepler.gl Logo',
        src: 'img/favicon.png'
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Docs'
        },
        {to: '/docs/user-guides', label: 'User Guide', position: 'left'},
        {to: '/policy', label: 'Support Policy', position: 'left'},
        {
          href: 'https://github.com/keplergl/kepler.gl',
          label: 'GitHub',
          position: 'right'
        },
        {
          href: 'https://www.openvisualization.org',
          label: 'OpenJS Foundation',
          position: 'right'
        }
      ]
    },
    // TODO: Update footer links
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Resources',
          items: [
            {
              label: 'API Reference',
              to: '/docs/api-reference'
            },
            {
              label: 'Starter templates',
              href: 'https://github.com/visgl/deck.gl/tree/master/examples/get-started'
            },
            {
              label: 'Playground',
              href: '/demo'
            }
          ]
        },
        {
          title: 'Other vis.gl Libraries',
          items: [
            {
              label: 'deck.gl-community',
              href: 'https://visgl.github.io/deck.gl-community/'
            },
            {
              label: 'luma.gl',
              href: 'https://luma.gl'
            },
            {
              label: 'loaders.gl',
              href: 'https://loaders.gl'
            },
            {
              label: 'react-map-gl',
              href: 'https://visgl.github.io/react-map-gl'
            }
          ]
        },
        {
          title: 'More',
          items: [
            {
              label: 'Slack workspace',
              href: 'https://slack-invite.openjsf.org'
            },
            {
              label: 'vis.gl blog on Medium',
              href: 'https://medium.com/vis-gl'
            },
            {
              label: 'GitHub',
              href: 'https://github.com/keplergl/kepler.gl'
            }
          ]
        }
      ],
      copyright:
        '<div class="footer-copy">Copyright <a href="https://openjsf.org">OpenJS Foundation</a> and vis.gl contributors. All rights reserved. The <a href="https://openjsf.org">OpenJS Foundation</a> has registered trademarks and uses trademarks. For a list of trademarks of the <a href="https://openjsf.org">OpenJS Foundation</a>, please see our <a href="https://trademark-policy.openjsf.org">Trademark Policy</a> and <a href="https://trademark-list.openjsf.org">Trademark List</a>. Trademarks and logos not indicated on the <a href="https://trademark-list.openjsf.org">list of OpenJS Foundation trademarks</a> are trademarks&trade; or registered&reg; trademarks of their respective holders. Use of them does not imply any affiliation with or endorsement by them.<br><br><a href="https://openjsf.org">The OpenJS Foundation</a> | <a href="https://terms-of-use.openjsf.org">Terms of Use</a> | <a href="https://privacy-policy.openjsf.org">Privacy Policy</a> | <a href="https://bylaws.openjsf.org">Bylaws</a> | <a href="https://code-of-conduct.openjsf.org">Code of Conduct</a> | <a href="https://trademark-policy.openjsf.org">Trademark Policy</a> | <a href="https://trademark-list.openjsf.org">Trademark List</a> | <a href="https://www.linuxfoundation.org/cookies">Cookie Policy</a></div>'
    },
    algolia: {
      // The application ID provided by Algolia
      appId: '8EVYAVB4KT',
      // Public API key: it is safe to commit it
      apiKey: 'a3fe1388353d733272ffdf148c53eeaa',
      indexName: 'kepler',
      // Optional: see doc section below
      contextualSearch: true,
      // Optional: path for search page that enabled by default (`false` to disable it)
      searchPagePath: false
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula
    }
  } satisfies Preset.ThemeConfig
};

export default config;
