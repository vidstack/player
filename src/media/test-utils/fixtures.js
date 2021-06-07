/** Dependencies  */
import './define';
import '../container/define';
import '../controller/define';

import { fixture } from '@open-wc/testing';
import { html } from 'lit';

import { VDS_MEDIA_CONTAINER_ELEMENT_TAG_NAME } from '../container';
import { MediaControllerElement } from '../controller';
import { VDS_FAKE_MEDIA_PROVIDER_ELEMENT_TAG_NAME } from './constants';

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

	const container = controller.querySelector(
		VDS_MEDIA_CONTAINER_ELEMENT_TAG_NAME
	);

	const provider = controller.querySelector(
		VDS_FAKE_MEDIA_PROVIDER_ELEMENT_TAG_NAME
	);

	return {
		controller,
		container,
		provider
	};
}
