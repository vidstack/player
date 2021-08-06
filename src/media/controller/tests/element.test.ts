import { expect, fixture, oneEvent } from '@open-wc/testing';
import { html } from 'lit';
import { mock, spy } from 'sinon';

import { vdsEvent } from '../../../base/events';
import { raf } from '../../../utils/dom';
import { isFunction } from '../../../utils/unit';
import { CanPlay } from '../../CanPlay';
import { VolumeChangeEvent } from '../../events';
import { MediaRemoteControl } from '../../interact';
import {
  buildMediaFixture,
  FAKE_MEDIA_PROVIDER_ELEMENT_TAG_NAME
} from '../../test-utils';
import {
  MEDIA_CONTROLLER_ELEMENT_TAG_NAME,
  MediaControllerConnectEvent,
  MediaControllerElement
} from '../MediaControllerElement';

describe(MEDIA_CONTROLLER_ELEMENT_TAG_NAME, function () {
  describe('lifcycle', function () {
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

  describe('discovery', function () {
    it('should dispatch connect event when connected to DOM', async function () {
      const controller = document.createElement(
        MEDIA_CONTROLLER_ELEMENT_TAG_NAME
      );

      setTimeout(() => {
        window.document.body.append(controller);
      });

      const { detail } = (await oneEvent(
        document,
        'vds-media-controller-connect'
      )) as MediaControllerConnectEvent;

      expect(detail.element).to.be.instanceOf(MediaControllerElement);
      expect(isFunction(detail.onDisconnect)).to.be.true;
    });
  });

  describe('media container', function () {
    it('should connect/disconnect', async function () {
      const controller = await fixture<MediaControllerElement>(
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
      const controller = await fixture<MediaControllerElement>(
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
      await provider.forceMediaReady();
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

      await oneEvent(controller, 'vds-media-provider-connect');

      await provider.forceMediaReady();
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
          vdsEvent('vds-volume-change', {
            detail,
            originalEvent
          })
        );
      }, 0);

      const event = (await oneEvent(
        controller,
        'vds-volume-change'
      )) as VolumeChangeEvent;

      expect(event.detail).to.equal(detail);
      expect(event.originalEvent).to.equal(originalEvent);
    });
  });

  describe('media requests', function () {
    it('should handle mute request', async function () {
      const { container, provider } = await buildMediaFixture();
      const setMutedSpy = spy(provider, '_setMuted');
      const remote = new MediaRemoteControl(container);
      remote.mute();
      await provider.mediaRequestQueue.flush();
      expect(setMutedSpy).to.have.been.calledWith(true);
      setMutedSpy.restore();
    });

    it('should handle unmute request', async function () {
      const { container, provider } = await buildMediaFixture();
      provider.muted = true;
      await provider.forceMediaReady();
      const setMutedSpy = spy(provider, '_setMuted');
      const remote = new MediaRemoteControl(container);
      remote.unmute();
      expect(setMutedSpy).to.have.been.calledWith(false);
      setMutedSpy.restore();
    });

    it('should handle play request', async function () {
      const { container, provider } = await buildMediaFixture();
      const playSpy = spy(provider, 'play');
      const remote = new MediaRemoteControl(container);
      remote.play();
      await provider.mediaRequestQueue.flush();
      expect(playSpy).to.have.been.calledOnce;
      playSpy.restore();
    });

    it('should handle pause request', async function () {
      const { container, provider } = await buildMediaFixture();
      provider.paused = false;
      await provider.forceMediaReady();
      const pauseSpy = spy(provider, 'pause');
      const remote = new MediaRemoteControl(container);
      remote.pause();
      expect(pauseSpy).to.have.been.calledOnce;
      pauseSpy.restore();
    });

    it('should handle seek request', async function () {
      const { container, provider } = await buildMediaFixture();
      const setCurrentTimeSpy = spy(provider, '_setCurrentTime');
      const remote = new MediaRemoteControl(container);
      remote.seek(100);
      await provider.mediaRequestQueue.flush();
      expect(setCurrentTimeSpy).to.have.been.calledWith(100);
      setCurrentTimeSpy.restore();
    });

    it('should handle seeking request', async function () {
      const { container, provider } = await buildMediaFixture();
      const setCurrentTimeSpy = spy(provider, '_setCurrentTime');
      const remote = new MediaRemoteControl(container);
      remote.seeking(100);
      await provider.mediaRequestQueue.flush();
      expect(setCurrentTimeSpy).to.have.been.calledWith(100);
      setCurrentTimeSpy.restore();
    });

    it('should handle volume change request', async function () {
      const { container, provider } = await buildMediaFixture();
      provider.volume = 0.5;
      await provider.forceMediaReady();
      const setVolumeSpy = spy(provider, '_setVolume');
      const remote = new MediaRemoteControl(container);
      remote.changeVolume(100);
      expect(setVolumeSpy).to.have.been.calledWith(1);
      setVolumeSpy.restore();
    });

    // eslint-disable-next-line mocha/no-skipped-tests
    it('should handle enter fullscreen request', async function () {
      const { container } = await buildMediaFixture();
      const requestFullscreenMock = mock();
      container.requestFullscreen = requestFullscreenMock;
      const remote = new MediaRemoteControl(container);
      remote.enterFullscreen();
      expect(requestFullscreenMock).to.have.been.called;
    });

    // eslint-disable-next-line mocha/no-skipped-tests
    it('should handle exit fullscreen request', async function () {
      const { container } = await buildMediaFixture();
      const exitFullscreenMock = mock();
      container.exitFullscreen = exitFullscreenMock;
      const remote = new MediaRemoteControl(container);
      remote.exitFullscreen();
      expect(exitFullscreenMock).to.have.been.called;
    });
  });
});
