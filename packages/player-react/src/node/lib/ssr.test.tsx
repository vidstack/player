import '@vidstack/foundation/shims/install-ssr.js';

import fs from 'fs';
import path from 'path';
import * as React from 'react';
import { renderToString } from 'react-dom/server';

import { createComponent } from './create-component';
import { ssr } from './ssr.js';

const tags: string[] = [];
const elementsPath = path.resolve(process.cwd(), 'node_modules/@vidstack/player/elements.json');
const elements = JSON.parse(fs.readFileSync(elementsPath, { encoding: 'utf-8' }));
tags.push(...elements.components.map((c) => c.tagName));

for (const tag of tags) {
  it(`should SSR ${tag}`, async () => {
    const Component = createComponent(React, tag, { skipSSR: true });
    const reactHTML = renderToString(<Component />);
    const html = await ssr(reactHTML, [tag]);
    expect(html).to.matchSnapshot();
  });
}
