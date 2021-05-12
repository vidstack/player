import { elementUpdated, expect, html } from '@open-wc/testing';

import { buildMediaFixture } from '../../../../core/fakes/fakes.helpers';
import { ToggleButtonElement } from '../ToggleButtonElement';
import { VDS_TOGGLE_BUTTON_ELEMENT_TAG_NAME } from '../vds-toggle-button';

describe(VDS_TOGGLE_BUTTON_ELEMENT_TAG_NAME, () => {
  async function buildFixture(): Promise<{
    toggle: ToggleButtonElement;
  }> {
    const { container } = await buildMediaFixture(html`
      <vds-toggle-button>
        <div class="pressed" slot="pressed"></div>
        <div class="not-pressed"></div>
      </vds-toggle-button>
    `);

    const toggle = container.querySelector(
      VDS_TOGGLE_BUTTON_ELEMENT_TAG_NAME,
    ) as ToggleButtonElement;

    return { toggle };
  }

  it('should render DOM correctly', async () => {
    const { toggle } = await buildFixture();
    expect(toggle).dom.to.equal(`
      <vds-toggle-button>
        <div class="pressed" slot="pressed" hidden></div>
        <div class="not-pressed"></div>
      </vds-toggle-button>
    `);
  });

  it('should render shadow DOM correctly', async () => {
    const { toggle } = await buildFixture();
    expect(toggle).shadowDom.to.equal(`
      <vds-button
        id="root"
        class="root"
        part="root button"
        exportparts="root: button-root"
      >
        <slot name="pressed"></slot>
        <slot></slot>
      </button>
    `);
  });

  it('should toggle pressed state correctly', async () => {
    const { toggle } = await buildFixture();
    const button = toggle.shadowRoot?.querySelector('vds-button');

    toggle.pressed = false;
    await elementUpdated(toggle);

    expect(button).to.not.have.attribute('pressed');

    toggle.pressed = true;
    await elementUpdated(toggle);

    expect(button).to.have.attribute('pressed');
  });

  it('should set disabled attribute', async () => {
    const { toggle } = await buildFixture();
    const button = toggle.shadowRoot?.querySelector('vds-button');

    toggle.disabled = true;
    await elementUpdated(toggle);

    expect(button).to.have.attribute('disabled');
  });
});
