// Markdown (hast) plugins for Astro's Sätteri processor.
//
// Astro caches rendered Markdown, so a change to this file doesn't show on pages whose text
// hasn't changed. For a build, run `npx astro build --force` once. For the live preview, stop
// it, delete the `.astro` folder and start it again.

const isBlank = (node) => node.type === 'text' && !node.value.trim();
const isBreak = (node) => node.type === 'element' && node.tagName === 'br';
const isImage = (node) => node.type === 'element' && node.tagName === 'img';
const meaningful = (node) => node.children.filter((child) => !isBlank(child) && !isBreak(child));

/** The <img> a node stands for: the node itself, or the only thing inside a link. */
const imageOf = (node) => {
  if (isImage(node)) return node;
  if (node.type === 'element' && node.tagName === 'a') {
    const inside = meaningful(node);
    if (inside.length === 1 && isImage(inside[0])) return inside[0];
  }
  return undefined;
};

const element = (tagName, properties, children) => ({
  type: 'element',
  tagName,
  properties,
  children,
});

/**
 * A paragraph that holds nothing but images becomes a <figure>.
 *
 *   ![Alt text](./photo.jpg "This title becomes the caption")
 *
 * Several images in one paragraph become a side-by-side gallery; the first
 * title found captions the whole group. An image wrapped in a link keeps its link:
 *
 *   [![Alt text](./photo.jpg "Caption")](https://example.com)
 *
 * A class written after an image moves to its figure, so `{.narrow}` keeps a portrait photo
 * from filling the page:
 *
 *   ![Alt text](./portrait.jpg "Caption"){.narrow}
 */
export const figures = {
  name: 'figures',
  element: {
    filter: ['p'],
    visit(node, ctx) {
      const content = meaningful(node);
      if (content.length === 0 || !content.every(imageOf)) return;

      const count = content.length;
      // Up to three images share one row; four make a 2 × 2 grid; more wrap in threes.
      const columns = count <= 3 ? count : count === 4 ? 2 : 3;

      // Classes written on the images ({.narrow}) belong to the figure as a whole.
      // Both spellings of the property are accepted: `className` (a list) and `class` (a string).
      const classes = new Set(
        content.flatMap((item) => {
          const { className = [], class: classText = '' } = imageOf(item).properties ?? {};
          return [className, classText].flat().join(' ').split(/\s+/);
        }),
      );
      classes.delete('');
      if (count > 1) classes.add('gallery');

      // Tell the browser how wide each image is shown, so it downloads a file of the right size.
      const width = classes.has('narrow') ? 26 : 41;
      const sizes = `(min-width: 46rem) ${Math.ceil(width / columns)}rem, ${Math.ceil(92 / columns)}vw`;

      const caption = content.map((item) => imageOf(item).properties?.title).find(Boolean);
      const images = content.map((item) => {
        const { title, className, class: classText, ...properties } = imageOf(item).properties ?? {};
        const img = element('img', { ...properties, sizes }, []);
        return isImage(item) ? img : element('a', item.properties ?? {}, [img]);
      });

      const children = [...images];
      if (caption) {
        children.push(element('figcaption', {}, [{ type: 'text', value: String(caption) }]));
      }

      const properties = {};
      if (classes.size > 0) properties.className = [...classes];
      if (count > 1) properties.style = `--columns: ${columns}`;
      ctx.replaceNode(node, element('figure', properties, children));
    },
  },
};

/** Wide tables scroll inside their own box instead of stretching the page on phones. */
export const scrollableTables = {
  name: 'scrollable-tables',
  element: {
    filter: ['table'],
    visit(node, ctx) {
      ctx.wrapNode(node, element('div', { className: ['table-scroll'] }, []));
    },
  },
};
