/** Dependencies  */
import './vds-fake-media-provider';
import '../media/container/vds-media-container';
import '../media/controller/vds-media-controller';

import { fixture } from '@open-wc/testing';
import { html } from 'lit';

import { MediaContainerElement, MediaControllerElement } from '../media';
import { VDS_MEDIA_CONTAINER_ELEMENT_TAG_NAME } from '../media/container/vds-media-container';
import { FakeMediaProviderElement } from './FakeMediaProviderElement';
import { VDS_FAKE_MEDIA_PROVIDER_ELEMENT_TAG_NAME } from './vds-fake-media-provider';

export function emitEventWithTimeout(el: HTMLElement, event: Event): void {
  setTimeout(() => el.dispatchEvent(event));
}

export interface MediaFixture {
  controller: MediaControllerElement;
  container: MediaContainerElement;
  provider: FakeMediaProviderElement;
}

export async function buildMediaFixture(
  uiSlot = html``,
  mediaSlot = html``,
): Promise<MediaFixture> {
  const controller = await fixture<MediaControllerElement>(
    html`
      <vds-media-controller>
        <vds-media-container>
          <vds-fake-media-provider slot="media">
            ${mediaSlot}
          </vds-fake-media-provider>
          ${uiSlot}
        </vds-media-container>
      </vds-media-controller>
    `,
  );

  const container = controller.querySelector(
    VDS_MEDIA_CONTAINER_ELEMENT_TAG_NAME,
  ) as MediaContainerElement;

  const provider = controller.querySelector(
    VDS_FAKE_MEDIA_PROVIDER_ELEMENT_TAG_NAME,
  ) as FakeMediaProviderElement;

  return {
    controller,
    container,
    provider,
  };
}
