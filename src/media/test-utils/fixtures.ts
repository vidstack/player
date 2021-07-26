import { fixture } from '@open-wc/testing';
import { safelyDefineCustomElement } from '@utils/dom';
import { html } from 'lit';

import {
  MEDIA_CONTAINER_ELEMENT_TAG_NAME,
  MediaContainerElement
} from '../container/index';
import {
  MEDIA_CONTROLLER_ELEMENT_TAG_NAME,
  MediaControllerElement
} from '../controller/index';
import {
  FAKE_MEDIA_PROVIDER_ELEMENT_TAG_NAME,
  FakeMediaProviderElement
} from './fake-media-provider/index';

safelyDefineCustomElement(
  FAKE_MEDIA_PROVIDER_ELEMENT_TAG_NAME,
  FakeMediaProviderElement
);
safelyDefineCustomElement(
  MEDIA_CONTAINER_ELEMENT_TAG_NAME,
  MediaContainerElement
);
safelyDefineCustomElement(
  MEDIA_CONTROLLER_ELEMENT_TAG_NAME,
  MediaControllerElement
);

export type MediaFixture = {
  controller: MediaControllerElement;
  container: MediaContainerElement;
  provider: FakeMediaProviderElement;
};

export async function buildMediaFixture(
  uiSlot = html``,
  mediaSlot = html``
): Promise<MediaFixture> {
  const controller = await fixture<MediaControllerElement>(
    html`
      <vds-media-controller>
        <vds-media-container>
          <vds-fake-media-provider>${mediaSlot}</vds-fake-media-provider>
          ${uiSlot}
        </vds-media-container>
      </vds-media-controller>
    `
  );

  const container = controller.querySelector(
    MEDIA_CONTAINER_ELEMENT_TAG_NAME
  ) as MediaContainerElement;

  const provider = controller.querySelector(
    FAKE_MEDIA_PROVIDER_ELEMENT_TAG_NAME
  ) as FakeMediaProviderElement;

  return {
    controller,
    container,
    provider
  };
}
