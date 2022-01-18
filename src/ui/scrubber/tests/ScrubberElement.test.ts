import '../../../define/vds-scrubber';

import { getDiffableSemanticHTML } from '@open-wc/semantic-dom-diff';
import { html } from 'lit';

import { buildMediaPlayerFixture } from '../../../media/test-utils';

async function buildFixture() {
  const { player } = await buildMediaPlayerFixture(html`
    <vds-scrubber></vds-scrubber>
  `);

  const scrubber = player.querySelector('vds-scrubber')!;

  return { scrubber };
}

test('light DOM snapshot', async function () {
  const { scrubber } = await buildFixture();
  expect(scrubber).dom.toMatchSnapshot();
});

test('shadow DOM snapshot', async function () {
  const { scrubber } = await buildFixture();
  expect(
    getDiffableSemanticHTML(scrubber.shadowRoot!.firstElementChild!)
  ).toMatchSnapshot();
});
