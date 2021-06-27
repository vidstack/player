import { expect, fixture, oneEvent } from '@open-wc/testing';
import { html } from 'lit';
import { mock, spy } from 'sinon';

import { raf } from '../../../utils/dom.js';
import { VdsVolumeChangeEvent } from '../../media.events.js';
import {
	VdsEnterFullscreenRequestEvent,
	VdsExitFullscreenRequestEvent,
	VdsMuteRequestEvent,
	VdsPauseRequestEvent,
	VdsPlayRequestEvent,
	VdsSeekRequestEvent,
	VdsUnmuteRequestEvent,
	VdsVolumeChangeRequestEvent
} from '../../media-request.events.js';
import {
	buildMediaFixture,
	VDS_FAKE_MEDIA_PROVIDER_ELEMENT_TAG_NAME
} from '../../test-utils/index.js';
import {
	MediaControllerElement,
	VDS_MEDIA_CONTROLLER_ELEMENT_TAG_NAME
} from '../MediaControllerElement.js';

describe(VDS_MEDIA_CONTROLLER_ELEMENT_TAG_NAME, function () {
	describe('render', function () {
		it('should render DOM correctly', async function () {
			const { controller } = await buildMediaFixture();
			expect(controller).dom.to.equal(`
        <vds-media-controller>
          <vds-media-container>
            <vds-fake-media-provider slot="media"></vds-fake-media-provider>
          </vds-media-container>
        </vds-media-controller>
      `);
		});

		it('should render shadow DOM correctly', async function () {
			const { controller } = await buildMediaFixture();
			expect(controller).shadowDom.to.equal('<slot></slot>');
		});
	});

	describe('media container', function () {
		it('should connect/disconnect', async function () {
			/** @type {MediaControllerElement} */
			const controller = await fixture(
				html`<vds-media-controller></vds-media-controller>`
			);

			const container = document.createElement('vds-media-container');
			controller.append(container);
			expect(controller.mediaContainer).to.equal(container);

			container.remove();
			expect(controller.mediaContainer).to.be.undefined;
		});
	});

	describe('media provider', function () {
		it('should connect/disconnect', async function () {
			/** @type {MediaControllerElement} */
			const controller = await fixture(
				html`<vds-media-controller></vds-media-controller>`
			);

			const provider = document.createElement(
				VDS_FAKE_MEDIA_PROVIDER_ELEMENT_TAG_NAME
			);

			controller.append(provider);
			expect(controller.mediaProvider).to.equal(provider);

			provider.remove();
			expect(controller.mediaProvider).to.be.undefined;
		});

		it('should forward attributes to the media provider', async function () {
			const { controller, provider } = await buildMediaFixture();

			provider.forceMediaReady();

			const setVolumeSpy = spy(provider, 'setVolume');

			controller.setAttribute('volume', '30');

			await raf();

			expect(setVolumeSpy).to.have.been.calledOnceWith(30);
		});

		it('should forward events from the media provider', async function () {
			const { controller, provider } = await buildMediaFixture();

			const detail = { volume: 30, muted: false };
			const originalEvent = new MouseEvent('click');

			setTimeout(() => {
				provider.dispatchEvent(
					new VdsVolumeChangeEvent({ detail, originalEvent })
				);
			}, 0);

			const event = /** @type {VdsVolumeChangeEvent} */ (
				await oneEvent(controller, VdsVolumeChangeEvent.TYPE)
			);

			expect(event.detail).to.equal(detail);
			expect(event.originalEvent).to.equal(originalEvent);
		});

		it('should forward properties to the media provider', async function () {
			const { controller, provider } = await buildMediaFixture();

			const playSpy = spy(provider, 'play');

			controller.play();

			expect(playSpy).to.have.been.calledOnce;
		});
	});

	describe('media requests', function () {
		it('should handle mute request', async function () {
			const { container, provider } = await buildMediaFixture();
			const setMutedSpy = spy(provider, 'setMuted');
			container.dispatchEvent(new VdsMuteRequestEvent());
			await provider.mediaRequestQueue.flush();
			expect(setMutedSpy).to.have.been.calledWith(true);
			setMutedSpy.restore();
		});

		it('should handle unmute request', async function () {
			const { container, provider } = await buildMediaFixture();
			const setMutedSpy = spy(provider, 'setMuted');
			container.dispatchEvent(new VdsUnmuteRequestEvent());
			await provider.mediaRequestQueue.flush();
			expect(setMutedSpy).to.have.been.calledWith(false);
			setMutedSpy.restore();
		});

		it('should handle play request', async function () {
			const { container, provider } = await buildMediaFixture();
			const playSpy = spy(provider, 'play');
			container.dispatchEvent(new VdsPlayRequestEvent());
			await provider.mediaRequestQueue.flush();
			expect(playSpy).to.have.been.calledOnce;
			playSpy.restore();
		});

		it('should handle pause request', async function () {
			const { container, provider } = await buildMediaFixture();
			const pauseSpy = spy(provider, 'pause');
			container.dispatchEvent(new VdsPauseRequestEvent());
			await provider.mediaRequestQueue.flush();
			expect(pauseSpy).to.have.been.calledOnce;
			pauseSpy.restore();
		});

		it('should handle seek request', async function () {
			const { container, provider } = await buildMediaFixture();
			const setCurrentTimeSpy = spy(provider, 'setCurrentTime');
			container.dispatchEvent(new VdsSeekRequestEvent({ detail: 100 }));
			await provider.mediaRequestQueue.flush();
			expect(setCurrentTimeSpy).to.have.been.calledWith(100);
			setCurrentTimeSpy.restore();
		});

		it('should handle volume change request', async function () {
			const { container, provider } = await buildMediaFixture();
			const setVolumeSpy = spy(provider, 'setVolume');
			container.dispatchEvent(new VdsVolumeChangeRequestEvent({ detail: 100 }));
			await provider.mediaRequestQueue.flush();
			expect(setVolumeSpy).to.have.been.calledWith(100);
			setVolumeSpy.restore();
		});

		it('should handle enter fullscreen request', async function () {
			const { container } = await buildMediaFixture();
			const requestFullscreenMock = mock();
			container.requestFullscreen = requestFullscreenMock;
			container.dispatchEvent(new VdsEnterFullscreenRequestEvent());
			expect(requestFullscreenMock).to.have.been.called;
		});

		it('should handle exit fullscreen request', async function () {
			const { container } = await buildMediaFixture();
			const exitFullscreenMock = mock();
			container.exitFullscreen = exitFullscreenMock;
			container.dispatchEvent(new VdsExitFullscreenRequestEvent());
			expect(exitFullscreenMock).to.have.been.called;
		});
	});
});
