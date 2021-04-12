import { elementUpdated, expect, html } from '@open-wc/testing';

import { FakeMediaProviderElement, ViewType } from '../../../core';
import { buildFakeMediaProvider } from '../../../core/fakes/fakes.helpers';
import { getSlottedChildren } from '../../../utils/dom';
import { UiElement } from '../UiElement';
import { VDS_UI_ELEMENT_TAG_NAME } from '../vds-ui';

describe(VDS_UI_ELEMENT_TAG_NAME, () => {
  async function buildFixture(): Promise<
    [FakeMediaProviderElement, UiElement]
  > {
    const provider = await buildFakeMediaProvider(html`
      <vds-ui>
        <div class="slot"></div>
      </vds-ui>
    `);

    const ui = provider.querySelector(VDS_UI_ELEMENT_TAG_NAME) as UiElement;

    return [provider, ui];
  }

  it('should render dom correctly', async () => {
    const [, ui] = await buildFixture();
    expect(ui).dom.to.equal(`
      <vds-ui>
        <div class="slot"></div>
      </vds-ui>
    `);
  });

  it('should render shadow dom correctly', async () => {
    const [, ui] = await buildFixture();
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
    const [, ui] = await buildFixture();
    const slottedChildren = getSlottedChildren(ui);
    expect(slottedChildren).to.have.length(1);
    expect(slottedChildren[0]).to.have.class('slot');
  });

  it('should toggle root-hidden css part as context updates', async () => {
    // Not ready.
    const [provider, ui] = await buildFixture();
    const root = ui.shadowRoot?.querySelector('#root') as HTMLDivElement;
    expect(root.getAttribute('part')).to.include('root-hidden');

    // Ready.
    provider.context.canPlay = true;
    await elementUpdated(ui);
    expect(root.getAttribute('part')).to.not.include('root-hidden');
  });

  it('should toggle root-audio-view css part as context updates', async () => {
    // Nay.
    const [provider, ui] = await buildFixture();
    const root = ui.shadowRoot?.querySelector('#root') as HTMLDivElement;
    expect(root.getAttribute('part')).to.not.include('root-audio-view');

    // Yay.
    provider.context.viewType = ViewType.Audio;
    await elementUpdated(ui);
    expect(root.getAttribute('part')).to.include('root-audio-view');
  });

  it('should toggle root-video-view css part as context updates', async () => {
    // Nay.
    const [provider, ui] = await buildFixture();
    const root = ui.shadowRoot?.querySelector('#root') as HTMLDivElement;
    expect(root.getAttribute('part')).to.not.include('root-video-view');

    // Yay.
    provider.context.viewType = ViewType.Video;
    await elementUpdated(ui);
    expect(root.getAttribute('part')).to.include('root-video-view');
  });
});
