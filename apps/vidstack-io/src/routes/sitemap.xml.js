import path from 'path';

export async function get() {
  const filePaths = Object.keys(await import.meta.glob('./**/*.{svelte,md}'));

  const urls = filePaths
    .filter((filePath) => {
      const fileName = path.basename(filePath);
      return !fileName.startsWith('_');
    })
    .map((filePath) =>
      filePath
        .slice(2)
        .replace(path.extname(filePath), '')
        .replace(/index$/, ''),
    )
    .map(
      (url) => `
			<url>
				<loc>https://vidstack.io/${url}</loc>
				<changefreq>daily</changefreq>
				<priority>0.7</priority>
			</url>
		`,
    )
    .join('\n');

  return {
    headers: {
      'Cache-Control': 'max-age=0, s-maxage=3600',
      'Content-Type': 'application/xml',
    },
    body: `
      <?xml version="1.0" encoding="UTF-8" ?>
      <urlset
        xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="https://www.w3.org/1999/xhtml"
        xmlns:mobile="https://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:news="https://www.google.com/schemas/sitemap-news/0.9"
        xmlns:image="https://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="https://www.google.com/schemas/sitemap-video/1.1"
      >
				${urls}
      </urlset>
    `.trim(),
  };
}
