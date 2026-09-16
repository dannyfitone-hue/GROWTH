import * as cheerio from 'cheerio';

function abs(base: string, href?: string | null) {
  if (!href) return null;
  try { return new URL(href, base).toString(); } catch { return null; }
}

export async function inspectWebsite(url?: string | null) {
  if (!url) return { title: null, description: null, logo: null, hero: null, favicon: null };
  try {
    const normalized = /^https?:\/\//i.test(url) ? url : `https://${url}`;
    const res = await fetch(normalized, { headers: { 'user-agent': 'RLFootageGrowthBot/1.0' }, redirect: 'follow', cache: 'no-store' });
    if (!res.ok) throw new Error(`Website returned ${res.status}`);
    const html = await res.text();
    const $ = cheerio.load(html);
    const title = $('title').first().text().trim() || null;
    const description = $('meta[name="description"]').attr('content')?.trim() || $('meta[property="og:description"]').attr('content')?.trim() || null;
    const og = abs(normalized, $('meta[property="og:image"]').attr('content'));
    const icon = abs(normalized, $('link[rel~="icon"]').first().attr('href')) || abs(normalized, $('link[rel="apple-touch-icon"]').first().attr('href'));
    let logo: string | null = null;
    $('img').each((_: number, el: any) => {
      if (logo) return;
      const src = $(el).attr('src');
      const marker = `${$(el).attr('alt') || ''} ${$(el).attr('class') || ''} ${$(el).attr('id') || ''}`.toLowerCase();
      if (src && /logo|brand/.test(marker)) logo = abs(normalized, src);
    });
    return { title, description, logo: logo || icon, hero: og, favicon: icon };
  } catch {
    return { title: null, description: null, logo: null, hero: null, favicon: null };
  }
}
