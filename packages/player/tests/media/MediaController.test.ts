import '$lib/define/vds-media';
import '$lib/define/vds-fake-media-provider';

import { fixture, html } from '@open-wc/testing-helpers';
import { get } from '@vidstack/foundation';

import { FakeMediaProviderElement, MediaElement, MediaRemoteControl } from '$lib';

async function buildFixture() {
  const provider = await fixture<FakeMediaProviderElement>(`
      <vds-fake-media-provider></vds-fake-media-provider>
  `);

  return { provider };
}

describe('media provider', () => {
  it('should connect/disconnect', async function () {
    const media = await fixture<MediaElement>(html`<vds-media></vds-media>`);
    const provider = document.createElement('vds-fake-media-provider');

    media.append(provider);
    expect(media.controller.mediaProvider === provider).to.be.true;

    provider.remove();
    expect(media.controller.mediaProvider).to.be.undefined;
  });

  it('should copy media provider store', async function () {
    const media = await fixture<MediaElement>(html`<vds-media></vds-media>`);
    const provider = document.createElement('vds-fake-media-provider');

    provider._store.currentSrc.set('testing');
    provider._store.duration.set(1000);

    media.append(provider);

    const controllerStore = media.controller.store;
    expect(get(controllerStore.currentSrc)).to.equal('testing');
    expect(get(controllerStore.duration)).to.equal(1000);
  });
});

describe('media requests', () => {
  it('should handle mute/unmute requests', async function () {
    const { provider } = await buildFixture();
    const mutedSpy = vi.spyOn(provider, 'muted', 'set');
    const remote = new MediaRemoteControl(provider);

    await provider.mediaRequestQueue.start();

    expect(mutedSpy).not.toHaveBeenCalled();

    remote.mute();
    expect(mutedSpy).toHaveBeenCalledWith(true);

    remote.unmute();
    expect(mutedSpy).toHaveBeenCalledWith(false);
  });

  it('should handle play/pause requests', async function () {
    const { provider } = await buildFixture();
    const pausedSpy = vi.spyOn(provider, 'paused', 'set');
    const remote = new MediaRemoteControl(provider);

    await provider.mediaRequestQueue.start();

    expect(pausedSpy).not.toHaveBeenCalled();

    remote.pause();
    expect(pausedSpy).toHaveBeenCalledWith(true);

    remote.play();
    expect(pausedSpy).toHaveBeenCalledWith(false);
  });

  it('should handle seeking/seek requests', async function () {
    const { provider } = await buildFixture();
    const currentTimeSpy = vi.spyOn(provider, 'currentTime', 'set');
    const remote = new MediaRemoteControl(provider);

    await provider.mediaRequestQueue.start();
    provider._store.duration.set(300);

    expect(currentTimeSpy).not.toHaveBeenCalled();

    remote.seeking(100);
    expect(currentTimeSpy).not.toHaveBeenCalled();

    remote.seek(200);
    expect(currentTimeSpy).toHaveBeenCalledWith(200);
  });

  it('should handle volume change request', async function () {
    const { provider } = await buildFixture();

    const volumeSpy = vi.spyOn(provider, 'volume', 'set');
    const remote = new MediaRemoteControl(provider);

    await provider.mediaRequestQueue.start();

    expect(volumeSpy).not.toHaveBeenCalled();

    remote.changeVolume(1);
    expect(volumeSpy).toHaveBeenCalledWith(1);
  });

  it.skip('should handle enter/exit fullscreen requests', async function () {
    const { provider } = await buildFixture();

    const requestFullscreenSpy = vi.spyOn(provider, 'requestFullscreen');
    const exitFullscreenSpy = vi.spyOn(provider, 'exitFullscreen');

    const remote = new MediaRemoteControl(provider);

    expect(requestFullscreenSpy).not.toHaveBeenCalled();
    expect(exitFullscreenSpy).not.toHaveBeenCalled();

    remote.enterFullscreen();
    expect(requestFullscreenSpy).toHaveBeenCalledWith(1);

    remote.exitFullscreen();
    expect(exitFullscreenSpy).toHaveBeenCalledWith(1);
  });
});
