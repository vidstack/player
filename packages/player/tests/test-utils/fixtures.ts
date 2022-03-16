import '$lib/define/vds-fake-media-provider';
import '$lib/define/vds-fake-media-player';

import { fixture } from '@open-wc/testing-helpers';
import { html } from 'lit';

import { FakeMediaPlayerElement, FakeMediaProviderElement, MediaControllerElement } from '$lib';

export type MediaFixture = {
  player: FakeMediaPlayerElement;
};

export async function buildMediaPlayerFixture(uiSlot = html``): Promise<MediaFixture> {
  const player = await fixture<FakeMediaPlayerElement>(
    html`
      <vds-fake-media-player>
        <div slot="ui">${uiSlot}</div>
      </vds-fake-media-player>
    `,
  );

  return { player };
}
