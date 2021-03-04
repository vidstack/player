import '../../../core/fakes/vds-fake-media-provider';

import { elementUpdated, expect, html } from '@open-wc/testing';

import { FakeMediaProvider } from '../../../core';
import { buildFakeMediaProvider } from '../../../core/fakes/helpers';
import { getSlottedChildren } from '../../../utils/dom';
import { Ui } from '../Ui';
import { UI_TAG_NAME } from '../vds-ui';

describe(UI_TAG_NAME, () => {
  async function buildFixture(): Promise<[FakeMediaProvider, Ui]> {
    const provider = await buildFakeMediaProvider(html`
      <vds-ui>
        <div class="slot"></div>
      </vds-ui>
    `);

    const ui = provider.querySelector('vds-ui') as Ui;

    return [provider, ui];
  }

  it('should render <slot>', async () => {
    const [, ui] = await buildFixture();
    const slottedChildren = getSlottedChildren(ui);
    expect(slottedChildren).to.have.length(1);
    expect(slottedChildren[0]).to.have.class('slot');
  });

  it('should toggle root-hidden css part as context updates', async () => {
    // Not ready.
    const [provider, ui] = await buildFixture();
    const root = ui.shadowRoot?.querySelector('.root') as HTMLDivElement;
    expect(root.getAttribute('part')).to.include('root-hidden');

    // Ready.
    provider.playerContext.isPlaybackReadyCtx = true;
    await elementUpdated(ui);
    expect(root.getAttribute('part')).to.not.include('root-hidden');
  });

  it('should toggle root-audio css part as context updates', async () => {
    // Nay.
    const [provider, ui] = await buildFixture();
    const root = ui.shadowRoot?.querySelector('.root') as HTMLDivElement;
    expect(root.getAttribute('part')).to.not.include('root-audio');

    // Yay.
    provider.playerContext.isAudioViewCtx = true;
    await elementUpdated(ui);
    expect(root.getAttribute('part')).to.include('root-audio');
  });

  it('should toggle root-video css part as context updates', async () => {
    // Nay.
    const [provider, ui] = await buildFixture();
    const root = ui.shadowRoot?.querySelector('.root') as HTMLDivElement;
    expect(root.getAttribute('part')).to.not.include('root-video');

    // Yay.
    provider.playerContext.isVideoViewCtx = true;
    await elementUpdated(ui);
    expect(root.getAttribute('part')).to.include('root-video');
  });
});
