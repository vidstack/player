import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit-html';
import { mock, spy } from 'sinon';

import { buildMediaFixture } from '../../../fakes/fakes.helpers';
import {
  VdsEnterFullscreenRequestEvent,
  VdsExitFullscreenRequestEvent,
  VdsMuteRequestEvent,
  VdsPauseRequestEvent,
  VdsPlayRequestEvent,
  VdsSeekRequestEvent,
  VdsUnmuteRequestEvent,
  VdsVolumeChangeRequestEvent,
} from '../../media-request.events';
import { MediaControllerElement } from '../MediaControllerElement';
import { VDS_MEDIA_CONTROLLER_ELEMENT_TAG_NAME } from '../vds-media-controller';

describe(VDS_MEDIA_CONTROLLER_ELEMENT_TAG_NAME, () => {
  describe('render', () => {
    it('should render DOM correctly', async () => {
      const { controller } = await buildMediaFixture();
      expect(controller).dom.to.equal(`
        <vds-media-controller>
          <vds-media-container>
            <vds-fake-media-provider slot="media"></vds-fake-media-provider>
          </vds-media-container>
        </vds-media-controller>
      `);
    });

    it('should render shadow DOM correctly', async () => {
      const { controller } = await buildMediaFixture();
      expect(controller).shadowDom.to.equal('<slot></slot>');
    });
  });

  describe('media container', () => {
    it('should connect/disconnect', async () => {
      const controller = await fixture<MediaControllerElement>(
        html`<vds-media-controller></vds-media-controller>`,
      );

      const container = document.createElement('vds-media-container');
      controller.append(container);
      expect(controller.mediaContainer).to.equal(container);

      container.remove();
      expect(controller.mediaContainer).to.be.undefined;
    });
  });

  describe('media provider', () => {
    it('should connect/disconnect', async () => {
      const controller = await fixture<MediaControllerElement>(
        html`<vds-media-controller></vds-media-controller>`,
      );

      const provider = document.createElement('vds-fake-media-provider');
      controller.append(provider);
      expect(controller.mediaProvider).to.equal(provider);

      provider.remove();
      expect(controller.mediaProvider).to.be.undefined;
    });
  });

  describe('media requests', () => {
    it('should handle mute request', async () => {
      const { container, provider } = await buildMediaFixture();
      const setMutedSpy = spy(provider, 'setMuted');
      container.dispatchEvent(new VdsMuteRequestEvent());
      await provider.mediaRequestQueue.flush();
      expect(setMutedSpy).to.have.been.calledWith(true);
      setMutedSpy.restore();
    });

    it('should handle unmute request', async () => {
      const { container, provider } = await buildMediaFixture();
      const setMutedSpy = spy(provider, 'setMuted');
      container.dispatchEvent(new VdsUnmuteRequestEvent());
      await provider.mediaRequestQueue.flush();
      expect(setMutedSpy).to.have.been.calledWith(false);
      setMutedSpy.restore();
    });

    it('should handle play request', async () => {
      const { container, provider } = await buildMediaFixture();
      const playSpy = spy(provider, 'play');
      container.dispatchEvent(new VdsPlayRequestEvent());
      await provider.mediaRequestQueue.flush();
      expect(playSpy).to.have.been.calledOnce;
      playSpy.restore();
    });

    it('should handle pause request', async () => {
      const { container, provider } = await buildMediaFixture();
      const pauseSpy = spy(provider, 'pause');
      container.dispatchEvent(new VdsPauseRequestEvent());
      await provider.mediaRequestQueue.flush();
      expect(pauseSpy).to.have.been.calledOnce;
      pauseSpy.restore();
    });

    it('should handle seek request', async () => {
      const { container, provider } = await buildMediaFixture();
      const setCurrentTimeSpy = spy(provider, 'setCurrentTime');
      container.dispatchEvent(new VdsSeekRequestEvent({ detail: 100 }));
      await provider.mediaRequestQueue.flush();
      expect(setCurrentTimeSpy).to.have.been.calledWith(100);
      setCurrentTimeSpy.restore();
    });

    it('should handle volume change request', async () => {
      const { container, provider } = await buildMediaFixture();
      const setVolumeSpy = spy(provider, 'setVolume');
      container.dispatchEvent(new VdsVolumeChangeRequestEvent({ detail: 100 }));
      await provider.mediaRequestQueue.flush();
      expect(setVolumeSpy).to.have.been.calledWith(100);
      setVolumeSpy.restore();
    });

    it('should handle enter fullscreen request', async () => {
      const { container } = await buildMediaFixture();
      const requestFullscreenMock = mock();
      container.requestFullscreen = requestFullscreenMock;
      container.dispatchEvent(new VdsEnterFullscreenRequestEvent());
      expect(requestFullscreenMock).to.have.been.called;
    });

    it('should handle exit fullscreen request', async () => {
      const { container } = await buildMediaFixture();
      const exitFullscreenMock = mock();
      container.exitFullscreen = exitFullscreenMock;
      container.dispatchEvent(new VdsExitFullscreenRequestEvent());
      expect(exitFullscreenMock).to.have.been.called;
    });
  });
});
