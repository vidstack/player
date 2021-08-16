import { expect, fixture, oneEvent } from '@open-wc/testing';
import { html } from 'lit';
import { mock, spy } from 'sinon';

import { isFunction } from '../../../utils/unit';
import { MediaRemoteControl } from '../../interact';
import { FAKE_MEDIA_PROVIDER_ELEMENT_TAG_NAME } from '../../test-utils';
import {
  MEDIA_CONTROLLER_ELEMENT_TAG_NAME,
  MediaControllerConnectEvent,
  MediaControllerElement
} from '../MediaControllerElement';

describe(MEDIA_CONTROLLER_ELEMENT_TAG_NAME, function () {
  async function buildFixture() {
    const controller = await fixture<MediaControllerElement>(`
        <vds-media-controller>
          <vds-fake-media-provider></vds-fake-media-provider>
        </vds-media-controller>
      `);

    const provider = controller.querySelector(
      FAKE_MEDIA_PROVIDER_ELEMENT_TAG_NAME
    )!;

    return { controller, provider };
  }

  describe('lifcycle', function () {
    it('should render DOM correctly', async function () {
      const { controller } = await buildFixture();
      expect(controller).dom.to.equal(`
        <vds-media-controller>
          <vds-fake-media-provider></vds-fake-media-provider>
        </vds-media-controller>
      `);
    });

    it('should render shadow DOM correctly', async function () {
      const { controller } = await buildFixture();
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

  describe('media provider', function () {
    it('should connect/disconnect', async function () {
      const controller = await fixture<MediaControllerElement>(
        html`<vds-media-controller></vds-media-controller>`
      );

      const provider = document.createElement(
        FAKE_MEDIA_PROVIDER_ELEMENT_TAG_NAME
      );

      controller.append(provider);
      expect(controller.controller.mediaProvider).to.equal(provider);

      provider.remove();
      expect(controller.controller.mediaProvider).to.be.undefined;
    });
  });

  describe('media requests', function () {
    it('should handle mute request', async function () {
      const { provider } = await buildFixture();
      const setMutedSpy = spy(provider, '_setMuted');
      const remote = new MediaRemoteControl(provider);
      remote.mute();
      await provider.mediaRequestQueue.flush();
      expect(setMutedSpy).to.have.been.calledWith(true);
      setMutedSpy.restore();
    });

    it('should handle unmute request', async function () {
      const { provider } = await buildFixture();
      provider.muted = true;
      await provider.forceMediaReady();
      const setMutedSpy = spy(provider, '_setMuted');
      const remote = new MediaRemoteControl(provider);
      remote.unmute();
      expect(setMutedSpy).to.have.been.calledWith(false);
      setMutedSpy.restore();
    });

    it('should handle play request', async function () {
      const { provider } = await buildFixture();
      const playSpy = spy(provider, 'play');
      const remote = new MediaRemoteControl(provider);
      remote.play();
      await provider.mediaRequestQueue.flush();
      expect(playSpy).to.have.been.calledOnce;
      playSpy.restore();
    });

    it('should handle pause request', async function () {
      const { provider } = await buildFixture();
      provider.paused = false;
      await provider.forceMediaReady();
      const pauseSpy = spy(provider, 'pause');
      const remote = new MediaRemoteControl(provider);
      remote.pause();
      expect(pauseSpy).to.have.been.calledOnce;
      pauseSpy.restore();
    });

    it('should handle seek request', async function () {
      const { provider } = await buildFixture();
      const setCurrentTimeSpy = spy(provider, '_setCurrentTime');
      const remote = new MediaRemoteControl(provider);
      remote.seek(100);
      await provider.mediaRequestQueue.flush();
      expect(setCurrentTimeSpy).to.have.been.calledWith(100);
      setCurrentTimeSpy.restore();
    });

    it('should handle seeking request', async function () {
      const { provider } = await buildFixture();
      const setCurrentTimeSpy = spy(provider, '_setCurrentTime');
      const remote = new MediaRemoteControl(provider);
      remote.seeking(100);
      await provider.mediaRequestQueue.flush();
      expect(setCurrentTimeSpy).to.have.been.calledWith(100);
      setCurrentTimeSpy.restore();
    });

    it('should handle volume change request', async function () {
      const { provider } = await buildFixture();
      provider.volume = 0.5;
      await provider.forceMediaReady();
      const setVolumeSpy = spy(provider, '_setVolume');
      const remote = new MediaRemoteControl(provider);
      remote.changeVolume(100);
      expect(setVolumeSpy).to.have.been.calledWith(1);
      setVolumeSpy.restore();
    });

    it('should handle enter fullscreen request', async function () {
      const { controller, provider } = await buildFixture();
      const requestFullscreenMock = mock();
      controller.requestFullscreen = requestFullscreenMock;
      const remote = new MediaRemoteControl(provider);
      remote.enterFullscreen();
      expect(requestFullscreenMock).to.have.been.called;
    });

    it('should handle exit fullscreen request', async function () {
      const { controller, provider } = await buildFixture();
      const exitFullscreenMock = mock();
      controller.exitFullscreen = exitFullscreenMock;
      const remote = new MediaRemoteControl(provider);
      remote.exitFullscreen();
      expect(exitFullscreenMock).to.have.been.called;
    });
  });
});
