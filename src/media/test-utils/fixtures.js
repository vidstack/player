/** Dependencies  */
import './fake-media-provider/define.js';
import '../container/define.js';
import '../controller/define.js';

import { fixture } from '@open-wc/testing';
import { html } from 'lit';

import {
  MEDIA_CONTAINER_ELEMENT_TAG_NAME,
  MediaContainerElement} from '../container/index.js';
import { MediaControllerElement } from '../controller/index.js';
import {
  FAKE_MEDIA_PROVIDER_ELEMENT_TAG_NAME,
  FakeMediaProviderElement} from './fake-media-provider/index.js';

/**
 * @param {import('lit').TemplateResult} [uiSlot]
 * @param {import('lit').TemplateResult} [mediaSlot]
 * @returns {Promise<import('./types').MediaFixture>}
 */
export async function buildMediaFixture(uiSlot = html``, mediaSlot = html``) {
  /** @type {MediaControllerElement} */
  const controller = await fixture(
    html`
      <vds-media-controller>
        <vds-media-container>
          <vds-fake-media-provider slot="media">
            ${mediaSlot}
          </vds-fake-media-provider>
          ${uiSlot}
        </vds-media-container>
      </vds-media-controller>
    `
  );

  const container = /** @type {MediaContainerElement} */ (
    controller.querySelector(MEDIA_CONTAINER_ELEMENT_TAG_NAME)
  );

  const provider = /** @type {FakeMediaProviderElement} */ (
    controller.querySelector(FAKE_MEDIA_PROVIDER_ELEMENT_TAG_NAME)
  );

  return {
    controller,
    container,
    provider
  };
}
