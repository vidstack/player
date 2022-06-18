import '$define/vds-media';
import '$define/vds-fake-media-provider';

import { fixture } from '@open-wc/testing-helpers';
import { html } from 'lit';

import { MediaElement } from '../media/MediaElement';
import { FakeMediaProviderElement } from './FakeMediaProviderElement';

export type MediaFixture = {
  media: MediaElement;
  provider: FakeMediaProviderElement;
};

export async function buildMediaFixture(uiSlot = html``): Promise<MediaFixture> {
  const media = await fixture<MediaElement>(
    html`
      <vds-media>
        <vds-fake-media-provider></vds-fake-media-provider>

        ${uiSlot}
      </vds-media>
    `,
  );

  const provider = media.querySelector('vds-fake-media-provider') as FakeMediaProviderElement;

  return { media, provider };
}
