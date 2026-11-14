import rss from '@astrojs/rss';
import { getStream } from '../lib/content';
import { SITE } from '../lib/site';

export async function GET(context) {
  const stream = await getStream();

  return rss({
    title: SITE.name,
    description: SITE.tagline,
    site: context.site,
    items: stream.map((item) => ({
      title: item.title,
      description: item.summary,
      pubDate: item.date,
      link: item.href,
      categories: item.tags,
    })),
  });
}
