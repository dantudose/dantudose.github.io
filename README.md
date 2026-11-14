# Signal & Noise

Field notes on hardware, code, and building things. The source for <https://dantudose.github.io>.

The site is built with [Astro](https://astro.build). Every push to `main` rebuilds and publishes it through GitHub Actions, so adding a Markdown file — from your editor or straight from the GitHub web UI — is all it takes to publish.

## Where things go

| To add…        | Create a file in…          | It is published at…        |
| -------------- | -------------------------- | -------------------------- |
| An article     | `src/content/articles/`    | `/articles/<file-name>/`   |
| A note         | `src/content/notes/`       | `/notes/<file-name>/`      |
| A project      | `src/content/projects/`    | `/projects/<file-name>/`   |
| A lab page     | `public/labs/`             | `/labs/<file-name>.html`   |
| Images         | `src/assets/<any-folder>/` | resized automatically      |

The file name becomes the address, so use lowercase words separated by hyphens: `ble-sniffer-notes.md`.

### Article

Long-form write-ups. `src/content/articles/my-article.md`:

```md
---
title: The title of the article
description: One or two sentences shown under the title, in lists and in link previews.
date: 2026-11-14
tags: [esp32, power]
project: hacktor-watch                      # optional: file name of a project
cover: ../../assets/my-article/cover.jpg    # optional: wide image under the title
coverAlt: What the cover image shows        # describe the image when there is a cover
updated: 2026-12-01                         # optional
draft: true                                 # optional: keeps it off the published site
---

The article, in Markdown.
```

### Note

Short entries. The Notes page shows each one in full. Copy `src/content/notes/_template.md`, or create `src/content/notes/my-note.md`:

```md
---
title: A short title
date: 2026-11-14
tags: [tools]
project: hacktor-watch    # optional
---

A paragraph or two.
```

### Project

A hub page. Every article and note whose `project:` matches the file name is listed in its log. `src/content/projects/my-project.md`:

```md
---
title: My Project
description: One sentence about what it is.
status: active            # active, paused, shipped or archived
started: 2026-03-01       # optional
cover: ../../assets/my-project/cover.jpg
coverAlt: What the cover image shows
links:
  - label: Source code
    href: https://github.com/dantudose/my-project
order: 1                  # optional: lower numbers are listed first
---

An overview, a spec table, anything else worth keeping on the project page.
```

### Lab page

Lab pages are plain, self-contained HTML files. Put the file in `public/labs/` and it is served untouched at `https://dantudose.github.io/labs/<file-name>.html`.

They are deliberately not part of Signal & Noise: nothing on the site links to them and they are not in the sitemap or the feed, so they are reached only through the address you hand out. Renaming or moving a file in `public/labs/` changes that address, which breaks links already given to people.

## Writing

Standard Markdown, plus a few extras:

- **Figures.** An image on its own line becomes a numbered figure, and its title becomes the caption:

  ```md
  ![Describe the image for people who can't see it](../../assets/my-article/board.jpg "The caption under the image.")
  ```

- **Galleries.** Put several images on consecutive lines, with no blank line between them, to show them side by side. Give one of them a title to caption the group.
- **Portrait images.** Add `{.narrow}` right after an image to keep a tall photo from filling the page: `![Alt](./portrait.jpg "Caption"){.narrow}`.
- **Linked images.** Wrap the image in a link and the figure goes to that address when clicked instead of zooming: `[![Alt](./shot.jpg "Caption")](https://example.com)`.
- **Video.** Put the file in `public/media/` and embed it with HTML. `data-autoplay` plays it, muted, while it is on screen; `class="narrow"` keeps a portrait video from filling the page.

  ```html
  <figure class="narrow">
    <video controls muted loop playsinline preload="metadata" data-autoplay poster="/media/my-article/clip-poster.webp">
      <source src="/media/my-article/clip.mp4" type="video/mp4" />
    </video>
    <figcaption>The caption under the video.</figcaption>
  </figure>
  ```
- **Code.** Fenced code blocks are syntax-highlighted and get a copy button. Name the language after the opening fence: ` ```c `, ` ```python `, ` ```sh `.
- **Tables** are styled as spec sheets and scroll sideways on phones.
- **Two entries on the same day.** Entries are listed newest first. To control the order of two with the same date, give the later one a time: `date: 2026-11-14T12:00:00Z`. Only the date is shown.
- **Drafts.** `draft: true` hides an entry from the published site while still showing it in the local preview. Files whose name starts with `_` are ignored completely.

Images are stored next to the code in `src/assets/` and referenced with a relative path, as above. Astro resizes and compresses them at build time, so full-size photos are fine.

## Preview on your own computer

Needs [Node.js](https://nodejs.org) 24, the version the deploy uses (22.23.4 or newer also works).

```sh
npm install     # once
npm run dev     # live preview at http://localhost:4321
npm run build   # production build into dist/
```

## Publishing

`.github/workflows/deploy.yml` builds the site and deploys it to GitHub Pages on every push to `main`. For that to work, the repository must be set to deploy from Actions: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

## Changing the site itself

| What                                   | Where                                  |
| -------------------------------------- | -------------------------------------- |
| Site name, tagline, navigation         | `src/lib/site.ts`                      |
| Colors, fonts, article typography      | `src/styles/global.css`                |
| About page                             | `src/pages/about.md`                   |
| Home page                              | `src/pages/index.astro`                |
| Header, footer, lists, waveform        | `src/components/`                      |
| Article, note and project front matter | `src/content.config.ts`                |
| Image shown in link previews           | `public/og.png`                        |
