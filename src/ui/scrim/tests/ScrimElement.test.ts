import '../../../define/vds-scrim';

import { fixture } from '@open-wc/testing-helpers';
import { html } from 'lit';

async function buildFixture() {
  const scrim = await fixture(html`<vds-scrim></vds-scrim>`);
  return { scrim };
}

test('light DOM snapshot', async function () {
  const { scrim } = await buildFixture();
  expect(scrim).dom.to.equal(`
    <vds-scrim direction="up"></vds-scrim>
  `);
});

test('shadow DOM snapshot', async function () {
  const { scrim } = await buildFixture();
  expect(scrim).shadowDom.to.equal(`
    <div id="gradient" part="gradient">
      <slot></slot>
    </div>
  `);
});
