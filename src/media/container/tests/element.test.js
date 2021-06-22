import { elementUpdated, expect, fixture, oneEvent } from '@open-wc/testing';
import { html } from 'lit';
import { mock } from 'sinon';

import { isFunction } from '../../../utils/unit.js';
import { buildMediaFixture } from '../../test-utils/index.js';
import { ViewType } from '../../ViewType.js';
import { VdsMediaContainerConnectEvent } from '../events.js';
import {
	MediaContainerElement,
	VDS_MEDIA_CONTAINER_ELEMENT_TAG_NAME
} from '../MediaContainerElement.js';

describe(VDS_MEDIA_CONTAINER_ELEMENT_TAG_NAME, function () {
	/**
	 * @param {import('lit').TemplateResult} slot
	 * @returns {Promise<MediaContainerElement>}
	 */
	async function buildFixture(slot = html``) {
		return fixture(html`<vds-media-container>${slot}</vds-media-container>`);
	}

	describe('render', function () {
		it('should render DOM correctly', async function () {
			const uiSlot = html`<div></div>`;
			const mediaSlot = html`
				<vds-fake-media-provider slot="media"></vds-fake-media-provider>
			`;
			const container = await buildFixture(html`${mediaSlot}${uiSlot}`);
			expect(container).dom.to.equal(`
        <vds-media-container>
          <vds-fake-media-provider slot="media"></vds-fake-media-provider>
          <div></div>
        </vds-media-container>
      `);
		});

		it('should render shadow DOM correctly', async function () {
			const container = await buildFixture();
			expect(container).shadowDom.to.equal(`
        <div
          id="root"
          part="root"
          style=""
          aria-busy="true"
        >
          <div
            id="media-container"
            part="media"
          >
            <slot name="media"></slot>
          </div>

					<slot></slot>
        </div>
      `);
		});
	});

	describe('props', function () {
		it('should set aria busy attribute correctly', async function () {
			const { provider, container } = await buildMediaFixture();

			const root = container.rootElement;
			expect(root).to.have.attribute('aria-busy', 'true');

			provider.context.canPlay = true;
			await elementUpdated(container);
			expect(root).to.have.attribute('aria-busy', 'false');
		});

		it('should apply aspect ratio given it is valid', async function () {
			const { container, provider } = await buildMediaFixture();

			provider.context.viewType = ViewType.Video;

			container.aspectRatio = '16:9';
			await elementUpdated(container);

			const root = container.rootElement;
			expect(root).to.have.class('with-aspect-ratio');
			expect(root.style.paddingBottom).to.equal('min(100vh, 56.25%)');
		});

		it('should not apply aspect ratio given it is invalid', async function () {
			const { container, provider } = await buildMediaFixture();

			provider.context.viewType = ViewType.Video;

			container.aspectRatio = '16-9';
			await elementUpdated(container);

			const root = container.rootElement;
			expect(root).to.not.have.class('with-aspect-ratio');
			expect(root.style.paddingBottom).to.equal('');
		});

		it('should not apply aspect ratio given view type is not video', async function () {
			const { container, provider } = await buildMediaFixture();

			provider.context.viewType = ViewType.Audio;

			container.aspectRatio = '16:9';
			await elementUpdated(container);

			const root = container.rootElement;
			expect(root).to.not.have.class('with-aspect-ratio');
			expect(root.style.paddingBottom).to.equal('');
		});

		it('should not apply aspect ratio given media is fullscreen', async function () {
			const { container, provider } = await buildMediaFixture();

			provider.context.viewType = ViewType.Video;
			provider.context.fullscreen = true;

			container.aspectRatio = '16:9';
			await elementUpdated(container);

			const root = container.rootElement;
			expect(root).to.not.have.class('with-aspect-ratio');
			expect(root.style.paddingBottom).to.equal('');
		});
	});

	describe('discovery', function () {
		it('should dispatch connect event when connected to DOM', async function () {
			const container = document.createElement('vds-media-container');

			setTimeout(() => {
				window.document.body.append(container);
			});

			const { detail } = /** @type {VdsMediaContainerConnectEvent} */ (
				await oneEvent(document, VdsMediaContainerConnectEvent.TYPE)
			);

			expect(detail.container).to.be.instanceOf(MediaContainerElement);
			expect(isFunction(detail.onDisconnect)).to.be.true;
		});

		it('should dispose of disconnect callbacks when disconnected from DOM', async function () {
			const container = document.createElement('vds-media-container');

			setTimeout(() => {
				window.document.body.append(container);
			});

			const { detail } = /** @type {VdsMediaContainerConnectEvent} */ (
				await oneEvent(document, VdsMediaContainerConnectEvent.TYPE)
			);

			const callback = mock();
			detail.onDisconnect(callback);

			container.remove();
			expect(callback).to.have.been.calledOnce;
		});
	});

	describe('element getters', function () {
		it('should return element [rootElement]', async function () {
			const container = await buildFixture();
			expect(container.rootElement).to.be.instanceOf(HTMLDivElement);
		});

		it('should return element [mediaContainerElement]', async function () {
			const container = await buildFixture();
			expect(container.mediaContainerElement).to.be.instanceOf(HTMLDivElement);
		});
	});

	describe('media provider', function () {
		it('should handle media slot change', async function () {
			const { container, provider } = await buildMediaFixture();
			expect(container.mediaProvider).to.equal(provider);
		});

		// Can't seem to catch it...?
		// eslint-disable-next-line mocha/no-skipped-tests
		it.skip('should throw error if invalid element passed in to media slot', function () {
			expect(() => {
				fixture(html`
					<vds-media-container>
						<div slot="media"></div>
					</vds-media-container>
				`);
			}).to.throw();
		});
	});
});
