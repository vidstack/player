import '$lib/define/vds-fake-media-provider';

import { fixture } from '@open-wc/testing-helpers';
import { html } from 'lit';

import { FakeMediaProviderElement } from '$lib';

export type MediaFixture = {
  player: FakeMediaPlayerElement;
};

export async function buildMediaPlayerFixture(uiSlot = html``): Promise<MediaFixture> {
  const player = await fixture<FakeMediaProviderElement>(
    html` <vds-fake-media-provider> </vds-fake-media-provider> `,
  );

  return { player };
}
