import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';

import { ScrimElement } from '../ScrimElement';

window.customElements.define('vds-scrim', ScrimElement);

describe('vds-scrim', function () {
  async function buildFixture() {
    const scrim = (await fixture(
      html`<vds-scrim></vds-scrim>`
    )) as ScrimElement;

    return { scrim };
  }

  test('it should render DOM correctly', async function () {
    const { scrim } = await buildFixture();
    expect(scrim).dom.to.equal(`
      <vds-scrim direction="up"></vds-scrim>
    `);
  });

  test('it should render shadow DOM correctly', async function () {
    const { scrim } = await buildFixture();
    expect(scrim).shadowDom.to.equal(`
      <div id="gradient" part="gradient">
        <slot></slot>
      </div>
    `);
  });
});
