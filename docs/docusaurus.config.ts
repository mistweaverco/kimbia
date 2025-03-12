import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

// This runs in Node.js
// - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: "Kimbia",
  tagline: "A minimal cross-platform task runner.",
  favicon: "img/favicon.png",

  url: "https://kimbia.mwco.app",
  baseUrl: "/docs",

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          path: "docs",
          routeBasePath: "/",
          sidebarPath: "./sidebars.ts",
          editUrl: "https://github.com/mistweaverco/kimbia/tree/main/docs/",
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: "img/kimbia-social-card.jpg",
    navbar: {
      title: "Kimbia Docs",
      logo: {
        alt: "Kimbia Logo",
        src: "img/logo.svg",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "tutorialSidebar",
          position: "left",
          label: "Getting Started",
        },
        {
          href: "https://github.com/mistweaverco/kimbia",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Getting Started",
          items: [
            {
              label: "Installation",
              to: "/installation",
            },
            {
              label: "Configuration",
              to: "/configuration",
            },
            {
              label: "Usage",
              to: "/usage",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "GitHub",
              href: "https://github.com/mistweaverco/kimbia",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} mistweaverco.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
