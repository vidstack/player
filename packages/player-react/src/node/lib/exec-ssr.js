import '@vidstack/foundation/shims/install-ssr.js';

import { ssr } from './ssr.js';

async function main() {
  const { html: reactHTML, tagNames } = /** @type {{ html: string; tagNames: string; }} */ (
    process.env
  );
  const html = await ssr(reactHTML, JSON.parse(tagNames));
  process.stdout.write(html);
}

main();
