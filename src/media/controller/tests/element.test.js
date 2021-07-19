import { expect, fixture, oneEvent } from '@open-wc/testing';
import { html } from 'lit';
import { mock, spy } from 'sinon';

import { raf } from '../../../utils/dom.js';
import { isFunction } from '../../../utils/unit.js';
import { CanPlay } from '../../CanPlay.js';
import { VolumeChangeEvent } from '../../events.js';
import { MediaProviderConnectEvent } from '../../provider/MediaProviderElement.js';
import {
  EnterFullscreenRequestEvent,
  ExitFullscreenRequestEvent,
  MuteRequestEvent,
  PauseRequestEvent,
  PlayRequestEvent,
  SeekingRequestEvent,
  SeekRequestEvent,
  UnmuteRequestEvent,
  VolumeChangeRequestEvent
} from '../../request.events.js';
import {
  buildMediaFixture,
  FAKE_MEDIA_PROVIDER_ELEMENT_TAG_NAME
} from '../../test-utils/index.js';
import { createTimeRanges } from '../../time-ranges.js';
import {
  MEDIA_CONTROLLER_ELEMENT_TAG_NAME,
  MediaControllerConnectEvent,
  MediaControllerElement
} from '../MediaControllerElement.js';

describe(MEDIA_CONTROLLER_ELEMENT_TAG_NAME, function () {
  describe('render', function () {
    it('should render DOM correctly', async function () {
      const { controller } = await buildMediaFixture();
      expect(controller).dom.to.equal(`
        <vds-media-controller>
          <vds-media-container>
            <vds-fake-media-provider></vds-fake-media-provider>
          </vds-media-container>
        </vds-media-controller>
      `);
    });

    it('should render shadow DOM correctly', async function () {
      const { controller } = await buildMediaFixture();
      expect(controller).shadowDom.to.equal('<slot></slot>');
    });
  });

  it('should provide immuatable media state', async function () {
    const { controller } = await buildMediaFixture();
    const state = controller.mediaState;

    expect(state.muted).to.be.false;
    expect(state.seekable.length).to.be.equal(0);

    // @ts-expect-error
    state.seekable.length = 10;
    expect(controller.mediaState.seekable.length).to.be.equal(0);
    controller.context.seekable = createTimeRanges(10, 20);

    expect(controller.mediaState.seekable.start(0)).to.be.equal(10);
    expect(controller.mediaState.seekable.end(0)).to.be.equal(20);
    expect(controller.mediaState.seekable.length).to.be.equal(1);
  });

  describe('discovery', function () {
    it('should dispatch connect event when connected to DOM', async function () {
      const controller = document.createElement(
        MEDIA_CONTROLLER_ELEMENT_TAG_NAME
      );

      setTimeout(() => {
        window.document.body.append(controller);
      });

      const { detail } = /** @type {MediaControllerConnectEvent} */ (
        await oneEvent(document, MediaControllerConnectEvent.TYPE)
      );

      expect(detail.element).to.be.instanceOf(MediaControllerElement);
      expect(isFunction(detail.onDisconnect)).to.be.true;
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
        FAKE_MEDIA_PROVIDER_ELEMENT_TAG_NAME
      );

      controller.append(provider);
      expect(controller.mediaProvider).to.equal(provider);

      provider.remove();
      expect(controller.mediaProvider).to.be.undefined;
    });

    it('should forward properties to the media provider', async function () {
      const { controller, provider } = await buildMediaFixture();
      provider.forceMediaReady();
      controller.paused = false;
      expect(provider.paused).to.be.false;
    });

    it('should forward properties to the media provider once connected', async function () {
      const { controller } = await buildMediaFixture();

      controller.innerHTML = '';

      const provider = document.createElement(
        FAKE_MEDIA_PROVIDER_ELEMENT_TAG_NAME
      );

      setTimeout(() => {
        controller.appendChild(provider);
      }, 0);

      controller.paused = false;

      await oneEvent(controller, MediaProviderConnectEvent.TYPE);

      provider.forceMediaReady();
      expect(provider.paused).to.be.false;
    });

    it('should forward methods to the media provider', async function () {
      const { controller, provider } = await buildMediaFixture();
      const canPlayTypeSpy = spy(provider, 'canPlayType');
      const result = controller.canPlayType('my-media.mp4');
      expect(result).to.equal(CanPlay.No);
      expect(canPlayTypeSpy).to.have.been.calledOnceWith('my-media.mp4');
    });

    it('should forward attributes to the media provider', async function () {
      const { controller, provider } = await buildMediaFixture();
      controller.setAttribute('muted', '');
      await raf();
      expect(provider).to.have.attribute('muted');
      controller.removeAttribute('muted');
      await raf();
      expect(provider).to.not.have.attribute('muted');
    });

    it('should forward events from the media provider', async function () {
      const { controller, provider } = await buildMediaFixture();

      const detail = { volume: 30, muted: false };
      const originalEvent = new MouseEvent('click');

      setTimeout(() => {
        provider.dispatchEvent(
          new VolumeChangeEvent({ detail, originalEvent })
        );
      }, 0);

      const event = /** @type {VolumeChangeEvent} */ (
        await oneEvent(controller, VolumeChangeEvent.TYPE)
      );

      expect(event.detail).to.equal(detail);
      expect(event.originalEvent).to.equal(originalEvent);
    });
  });

  describe('media requests', function () {
    it('should handle mute request', async function () {
      const { container, provider } = await buildMediaFixture();
      const setMutedSpy = spy(provider, 'setMuted');
      container.dispatchEvent(new MuteRequestEvent());
      await provider.mediaRequestQueue.flush();
      expect(setMutedSpy).to.have.been.calledWith(true);
      setMutedSpy.restore();
    });

    it('should handle unmute request', async function () {
      const { container, provider } = await buildMediaFixture();
      const setMutedSpy = spy(provider, 'setMuted');
      container.dispatchEvent(new UnmuteRequestEvent());
      await provider.mediaRequestQueue.flush();
      expect(setMutedSpy).to.have.been.calledWith(false);
      setMutedSpy.restore();
    });

    it('should handle play request', async function () {
      const { container, provider } = await buildMediaFixture();
      const playSpy = spy(provider, 'play');
      container.dispatchEvent(new PlayRequestEvent());
      await provider.mediaRequestQueue.flush();
      expect(playSpy).to.have.been.calledOnce;
      playSpy.restore();
    });

    it('should handle pause request', async function () {
      const { container, provider } = await buildMediaFixture();
      const pauseSpy = spy(provider, 'pause');
      container.dispatchEvent(new PauseRequestEvent());
      await provider.mediaRequestQueue.flush();
      expect(pauseSpy).to.have.been.calledOnce;
      pauseSpy.restore();
    });

    it('should handle seek request', async function () {
      const { container, provider } = await buildMediaFixture();
      const setCurrentTimeSpy = spy(provider, 'setCurrentTime');
      container.dispatchEvent(new SeekRequestEvent({ detail: 100 }));
      await provider.mediaRequestQueue.flush();
      expect(setCurrentTimeSpy).to.have.been.calledWith(100);
      setCurrentTimeSpy.restore();
    });

    it('should handle seeking request', async function () {
      const { container, provider } = await buildMediaFixture();
      const setCurrentTimeSpy = spy(provider, 'setCurrentTime');
      container.dispatchEvent(new SeekingRequestEvent({ detail: 100 }));
      await provider.mediaRequestQueue.flush();
      expect(setCurrentTimeSpy).to.have.been.calledWith(100);
      setCurrentTimeSpy.restore();
    });

    it('should handle volume change request', async function () {
      const { container, provider } = await buildMediaFixture();
      const setVolumeSpy = spy(provider, 'setVolume');
      container.dispatchEvent(new VolumeChangeRequestEvent({ detail: 1 }));
      await provider.mediaRequestQueue.flush();
      expect(setVolumeSpy).to.have.been.calledWith(1);
      setVolumeSpy.restore();
    });

    it('should handle enter fullscreen request', async function () {
      const { container } = await buildMediaFixture();
      const requestFullscreenMock = mock();
      container.requestFullscreen = requestFullscreenMock;
      container.dispatchEvent(new EnterFullscreenRequestEvent());
      expect(requestFullscreenMock).to.have.been.called;
    });

    it('should handle exit fullscreen request', async function () {
      const { container } = await buildMediaFixture();
      const exitFullscreenMock = mock();
      container.exitFullscreen = exitFullscreenMock;
      container.dispatchEvent(new ExitFullscreenRequestEvent());
      expect(exitFullscreenMock).to.have.been.called;
    });
  });
});
