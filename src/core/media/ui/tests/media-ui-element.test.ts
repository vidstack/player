import { elementUpdated, expect, html } from '@open-wc/testing';

import { getSlottedChildren } from '../../../../utils/dom';
import { FakeMediaProviderElement } from '../../../fakes/FakeMediaProviderElement';
import { buildMediaFixture } from '../../../fakes/fakes.helpers';
import { MediaUiElement } from '../MediaUiElement';
import { VDS_MEDIA_UI_ELEMENT_TAG_NAME } from '../vds-media-ui';

describe(VDS_MEDIA_UI_ELEMENT_TAG_NAME, () => {
  async function buildFixture(): Promise<{
    provider: FakeMediaProviderElement;
    ui: MediaUiElement;
  }> {
    const { container, provider } = await buildMediaFixture(html`
      <vds-media-ui>
        <div class="slot"></div>
      </vds-media-ui>
    `);

    const ui = container.querySelector(
      VDS_MEDIA_UI_ELEMENT_TAG_NAME,
    ) as MediaUiElement;

    return { provider, ui };
  }

  it('should render DOM correctly', async () => {
    const { ui } = await buildFixture();
    expect(ui).dom.to.equal(`
      <vds-media-ui>
        <div class="slot"></div>
      </vds-media-ui>
    `);
  });

  it('should render shadow DOM correctly', async () => {
    const { ui } = await buildFixture();
    expect(ui).shadowDom.to.equal(`
      <div 
        id="root"
        part="root root-hidden"
      >
        <slot />
      </div>
    `);
  });

  it('should render <slot>', async () => {
    const { ui } = await buildFixture();
    const slottedChildren = getSlottedChildren(ui);
    expect(slottedChildren).to.have.length(1);
    expect(slottedChildren[0]).to.have.class('slot');
  });

  it('should toggle root-hidden css part as context updates', async () => {
    // Not ready.
    const { provider, ui } = await buildFixture();
    const root = ui.shadowRoot?.querySelector('#root') as HTMLDivElement;
    expect(root.getAttribute('part')).to.include('root-hidden');

    // Ready.
    provider.context.canPlay = true;
    await elementUpdated(ui);
    expect(root.getAttribute('part')).to.not.include('root-hidden');
  });

  it('should return element [rootElement]', async () => {
    const { ui } = await buildFixture();
    expect(ui.rootElement).to.be.instanceOf(HTMLDivElement);
  });
});
