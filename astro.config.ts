import { defineConfig, passthroughImageService } from 'astro/config'
import starlight from '@astrojs/starlight'
import starlightBlog from 'starlight-blog'

import { remarkInlineHighlight } from './src/plugins/remarkInlineHighlight.js'

function meta(attrs: Record<string, any>) {
  return { tag: 'meta', attrs } as const
}

function link(attrs: Record<string, any>) {
  return { tag: 'link', attrs } as const
}

function googleFonts(...families: string[]) {
  return link({
    rel: 'stylesheet',
    href: `https://fonts.googleapis.com/css2?family=${families.join('&family=')}&display=swap`,
  })
}

// https://astro.build/config
export default defineConfig({
  site: 'https://pomsky-lang.org',
  markdown: {
    remarkPlugins: [remarkInlineHighlight],
    syntaxHighlight: 'shiki',
  },
  image: {
    service: passthroughImageService(),
  },
  integrations: [
    starlight({
      plugins: [
        starlightBlog({
          title: 'Pomsky Blog',
          navigation: 'none',
          metrics: { readingTime: true },
        }),
      ],
      title: 'Pomsky',
      logo: { src: './src/assets/favicon.svg' },
      editLink: { baseUrl: 'https://github.com/pomsky-lang/website/edit/main' },
      defaultLocale: 'en',
      lastUpdated: true,
      customCss: ['./src/styles/global.css'],
      routeMiddleware: './src/routeData.ts',
      head: [
        // theme colors
        meta({ name: 'theme-color', content: '#fff' }),
        meta({ name: 'msapplication-TileColor', content: '#fff' }),
        // favicon
        link({ rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' }),
        link({ rel: 'mask-icon', href: '/safari-pinned-tab.svg' }),
        // web manifest
        link({ rel: 'manifest', href: '/site.webmanifest' }),
        // fonts
        link({ rel: 'preconnect', href: 'https://fonts.googleapis.com' }),
        link({ rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }),
        googleFonts('Inter:wght@400;500;600;800', 'JetBrains+Mono:wght@400;700'),
      ],
      sidebar: [
        {
          label: 'Get Started',
          autogenerate: { directory: 'docs/get-started' },
        },
        {
          label: 'Language Tour',
          autogenerate: { directory: 'docs/language-tour' },
          collapsed: true,
        },
        {
          label: 'Reference',
          autogenerate: { directory: 'docs/reference' },
          collapsed: true,
        },
        {
          label: 'Examples',
          autogenerate: { directory: 'docs/examples' },
          collapsed: true,
        },
        {
          label: 'Appendix',
          autogenerate: { directory: 'docs/appendix' },
          collapsed: true,
        },
      ],
      components: {
        SocialIcons: './src/components/SocialIcons.astro',
      },
      // see <SocialIcons />
      // social: [
      //   { icon: 'github', label: 'GitHub', href: 'https://github.com/pomsky-lang/pomsky' },
      //   { icon: 'discord', label: 'Discord', href: 'https://discord.gg/uwap2uxMFp' },
      // ],
      expressiveCode: {
        themes: ['dark-plus', 'light-plus'],
        shiki: {
          langs: [
            import('./src/plugins/grammars/pomsky.js'),
            import('./src/plugins/grammars/regexp.js'),
          ],
        },
      },
    }),
  ],
})
