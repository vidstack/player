import { fixture } from '@open-wc/testing';
import { html } from 'lit';

import { safelyDefineCustomElement } from '../../utils/dom';
import {
  MEDIA_CONTROLLER_ELEMENT_TAG_NAME,
  MediaControllerElement
} from '../controller';
import {
  FAKE_MEDIA_PLAYER_ELEMENT_TAG_NAME,
  FakeMediaPlayerElement
} from './fake-media-player';
import {
  FAKE_MEDIA_PROVIDER_ELEMENT_TAG_NAME,
  FakeMediaProviderElement
} from './fake-media-provider';

safelyDefineCustomElement(
  FAKE_MEDIA_PLAYER_ELEMENT_TAG_NAME,
  FakeMediaPlayerElement
);

window.customElements.define(
  MEDIA_CONTROLLER_ELEMENT_TAG_NAME,
  MediaControllerElement
);

window.customElements.define(
  FAKE_MEDIA_PROVIDER_ELEMENT_TAG_NAME,
  FakeMediaProviderElement
);

export type MediaFixture = {
  player: FakeMediaPlayerElement;
};

export async function buildMediaPlayerFixture(
  uiSlot = html``
): Promise<MediaFixture> {
  const player = await fixture<FakeMediaPlayerElement>(
    html`
      <vds-fake-media-player>
        <div slot="ui">${uiSlot}</div>
      </vds-fake-media-player>
    `
  );

  return { player };
}
