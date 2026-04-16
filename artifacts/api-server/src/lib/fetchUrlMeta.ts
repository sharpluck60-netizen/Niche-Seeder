export type UrlMeta = {
  title: string;
  description: string;
  author: string;
  tags: string;
  raw: string;
};

const USER_AGENT =
  "Mozilla/5.0 (Linux; Android 12; Pixel 6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36";

async function fetchHtmlMeta(url: string): Promise<Partial<UrlMeta>> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "en-US,en;q=0.9",
      },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) return {};
    const html = await res.text();

    const og = (prop: string) => {
      const m = html.match(
        new RegExp(`<meta[^>]+property=["']og:${prop}["'][^>]+content=["']([^"']+)["']`, "i")
      ) || html.match(
        new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:${prop}["']`, "i")
      );
      return m?.[1]?.trim() ?? "";
    };

    const meta = (name: string) => {
      const m = html.match(
        new RegExp(`<meta[^>]+name=["']${name}["'][^>]+content=["']([^"']+)["']`, "i")
      ) || html.match(
        new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${name}["']`, "i")
      );
      return m?.[1]?.trim() ?? "";
    };

    const titleTag = html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim() ?? "";

    return {
      title: og("title") || titleTag,
      description: og("description") || meta("description"),
      author: meta("author") || og("site_name"),
      tags: meta("keywords"),
    };
  } catch {
    return {};
  }
}

async function fetchYouTubeMeta(url: string): Promise<Partial<UrlMeta>> {
  try {
    const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
    const res = await fetch(oembedUrl, { signal: AbortSignal.timeout(6000) });
    if (!res.ok) return {};
    const data = await res.json() as { title?: string; author_name?: string };
    return {
      title: data.title ?? "",
      author: data.author_name ?? "",
    };
  } catch {
    return {};
  }
}

export async function fetchUrlMeta(url: string, platform: string): Promise<UrlMeta> {
  let meta: Partial<UrlMeta> = {};

  if (platform === "YouTube") {
    const [oembed, html] = await Promise.all([
      fetchYouTubeMeta(url),
      fetchHtmlMeta(url),
    ]);
    meta = { ...html, ...oembed };
  } else {
    meta = await fetchHtmlMeta(url);
  }

  const parts: string[] = [];
  if (meta.title) parts.push(`Title: ${meta.title}`);
  if (meta.author) parts.push(`Creator: ${meta.author}`);
  if (meta.description) parts.push(`Description: ${meta.description}`);
  if (meta.tags) parts.push(`Tags: ${meta.tags}`);

  return {
    title: meta.title ?? "",
    description: meta.description ?? "",
    author: meta.author ?? "",
    tags: meta.tags ?? "",
    raw: parts.length > 0 ? parts.join("\n") : "",
  };
}
