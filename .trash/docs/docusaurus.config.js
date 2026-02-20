// @ts-check
import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'User Manual',
  tagline: 'คู่มือการใช้งานโปรแกรม',
  favicon: 'img/favicon.ico',

  url: 'https://your-username.github.io',
  baseUrl: '/',

  organizationName: 'your-username',
  projectName: 'your-project',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  // Ignore missing images during build (for placeholder documentation)
  markdown: {
    mermaid: true,
    format: 'mdx',
  },

  // Allow broken images during development
  staticDirectories: ['static'],

  i18n: {
    defaultLocale: 'th',
    locales: ['th', 'en'],
    localeConfigs: {
      th: {
        label: 'ไทย',
        direction: 'ltr',
      },
      en: {
        label: 'English',
        direction: 'ltr',
      },
    },
  },

  presets: [
    [
      'classic',
      ({
        docs: {
          sidebarPath: './sidebars.js',
          routeBasePath: '/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    ({
      image: 'img/user-manual-social-card.jpg',
      colorMode: {
        defaultMode: 'light',
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: 'คู่มือการใช้งาน',
        logo: {
          alt: 'Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'เนื้อหา',
          },
          {
            type: 'localeDropdown',
            position: 'right',
          },
          {
            href: 'https://github.com/your-username/your-project',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'คู่มือ',
            items: [
              {
                label: 'เริ่มต้นใช้งาน',
                to: '/',
              },
              {
                label: 'ฟีเจอร์',
                to: '/features',
              },
            ],
          },
          {
            title: 'ช่วยเหลือ',
            items: [
              {
                label: 'คำถามที่พบบ่อย',
                to: '/faq',
              },
              {
                label: 'ติดต่อเรา',
                to: '/contact',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Your Project. สงวนลิขสิทธิ์`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
