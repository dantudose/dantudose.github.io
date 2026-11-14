import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { satteri } from '@astrojs/markdown-satteri';
import { figures, scrollableTables } from './src/lib/markdown-plugins.mjs';

export default defineConfig({
  site: 'https://dantudose.github.io',
  integrations: [sitemap()],
  image: {
    // Markdown images and <Image /> get a srcset so phones don't download desktop-size files.
    layout: 'constrained',
  },
  markdown: {
    processor: satteri({
      hastPlugins: [figures, scrollableTables],
      // Allows {.class} after an image or other element, e.g. ![Alt](photo.jpg){.narrow}
      features: { attributes: true },
    }),
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      // Emit both palettes as CSS variables; global.css picks one per color scheme.
      defaultColor: false,
    },
  },
});
