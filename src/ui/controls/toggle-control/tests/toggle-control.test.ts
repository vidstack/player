import { elementUpdated, expect, html } from '@open-wc/testing';

import { FakeMediaProvider } from '../../../../core';
import { buildFakeMediaProvider } from '../../../../core/fakes/helpers';
import { ToggleControl } from '../ToggleControl';
import { TOGGLE_CONTROL_TAG_NAME } from '../vds-toggle-control';

describe(TOGGLE_CONTROL_TAG_NAME, () => {
  async function buildFixture(): Promise<[FakeMediaProvider, ToggleControl]> {
    const provider = await buildFakeMediaProvider(html`
      <vds-toggle-control>
        <div class="on" slot="on"></div>
        <div class="off" slot="off"></div>
      </vds-toggle-control>
    `);

    const toggle = provider.querySelector(
      TOGGLE_CONTROL_TAG_NAME,
    ) as ToggleControl;

    return [provider, toggle];
  }

  it('should render dom correctly', async () => {
    const [, toggle] = await buildFixture();
    expect(toggle).dom.to.equal(`
      <vds-toggle-control>
        <div class="on" slot="on" hidden></div>
        <div class="off" slot="off"></div>
      </vds-toggle-control>
    `);
  });

  it('should render shadow dom correctly', async () => {
    const [, toggle] = await buildFixture();
    expect(toggle).shadowDom.to.equal(`
      <vds-control
        id="root"
        class="root"
        part="root control"
        exportparts="button: control-button, root: control-root, root-mobile: control-root-mobile"
      >
        <slot name="on"></slot>
        <slot name="off"></slot>
      </button>
    `);
  });

  it('should toggle pressed state correctly', async () => {
    const [, toggle] = await buildFixture();
    const control = toggle.shadowRoot?.querySelector('vds-control');

    toggle.on = false;
    await elementUpdated(toggle);

    expect(control).to.not.have.attribute('pressed');

    toggle.on = true;
    await elementUpdated(toggle);

    expect(control).to.have.attribute('pressed');
  });

  it('should set disabled attribute', async () => {
    const [, toggle] = await buildFixture();
    const control = toggle.shadowRoot?.querySelector('vds-control');

    toggle.disabled = true;
    await elementUpdated(toggle);

    expect(control).to.have.attribute('disabled');
  });
});
