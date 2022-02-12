import { fixture } from '@open-wc/testing-helpers';
import { html } from 'lit';

import { safelyDefineCustomElement } from '../../utils/dom';
import { MediaControllerElement } from '../controller';
import { FakeMediaPlayerElement } from './fake-media-player';
import { FakeMediaProviderElement } from './fake-media-provider';

safelyDefineCustomElement('vds-fake-media-player', FakeMediaPlayerElement);
safelyDefineCustomElement('vds-media-controller', MediaControllerElement);
safelyDefineCustomElement('vds-fake-media-provider', FakeMediaProviderElement);

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
