import '../../../core/fakes/vds-fake-media-provider';

import { elementUpdated, expect, fixture, html } from '@open-wc/testing';

import { FakeMediaProvider } from '../../../core';
import { Ui } from '../Ui';
import { UI_TAG_NAME } from '../vds-ui';

describe(UI_TAG_NAME, () => {
  async function buildFixture(): Promise<[FakeMediaProvider, Ui]> {
    const provider = await fixture<FakeMediaProvider>(html`
      <vds-fake-media-provider>
        <vds-ui></vds-ui>
      </vds-fake-media-provider>
    `);

    const ui = provider.querySelector('vds-ui') as Ui;

    return [provider, ui];
  }

  it('should toggle ui-hidden css part as context updates', async () => {
    // Not ready.
    const [provider, ui] = await buildFixture();
    const root = ui.shadowRoot?.querySelector('.ui') as HTMLDivElement;
    expect(root.getAttribute('part')).to.include('ui-hidden');

    // Ready.
    provider.context.isPlaybackReadyCtx = true;
    await elementUpdated(ui);
    expect(root.getAttribute('part')).to.not.include('ui-hidden');
  });

  it('should toggle ui-audio css part as context updates', async () => {
    // Nay.
    const [provider, ui] = await buildFixture();
    const root = ui.shadowRoot?.querySelector('.ui') as HTMLDivElement;
    expect(root.getAttribute('part')).to.not.include('ui-audio');

    // Yay.
    provider.context.isAudioViewCtx = true;
    await elementUpdated(ui);
    expect(root.getAttribute('part')).to.include('ui-audio');
  });

  it('should toggle ui-video css part as context updates', async () => {
    // Nay.
    const [provider, ui] = await buildFixture();
    const root = ui.shadowRoot?.querySelector('.ui') as HTMLDivElement;
    expect(root.getAttribute('part')).to.not.include('ui-video');

    // Yay.
    provider.context.isVideoViewCtx = true;
    await elementUpdated(ui);
    expect(root.getAttribute('part')).to.include('ui-video');
  });
});
