import '$lib/define/vds-media';
import '$lib/define/vds-fake-media-provider';

import { MediaRemoteControl } from '$lib';
import { buildMediaFixture } from '$test-utils';

async function buildFixture() {
  return buildMediaFixture();
}

describe('media requests', () => {
  it('should handle mute/unmute requests', async function () {
    const { provider } = await buildFixture();
    const mutedSpy = vi.spyOn(provider, 'muted', 'set');
    const remote = new MediaRemoteControl(provider);

    provider.mediaQueue.start();

    expect(mutedSpy).not.toHaveBeenCalled();

    remote.mute();
    expect(mutedSpy).toHaveBeenCalledWith(true);

    provider.controller?._store.muted.set(true);
    remote.unmute();
    expect(mutedSpy).toHaveBeenCalledWith(false);
  });

  it('should handle play/pause requests', async function () {
    const { provider } = await buildFixture();
    const pausedSpy = vi.spyOn(provider, 'paused', 'set');
    const remote = new MediaRemoteControl(provider);

    provider.mediaQueue.start();

    expect(pausedSpy).not.toHaveBeenCalled();

    provider.controller?._store.paused.set(false);
    remote.pause();
    expect(pausedSpy).toHaveBeenCalledWith(true);

    provider.controller?._store.paused.set(true);
    remote.play();
    expect(pausedSpy).toHaveBeenCalledWith(false);
  });

  it('should handle seeking/seek requests', async function () {
    const { provider } = await buildFixture();
    const currentTimeSpy = vi.spyOn(provider, 'currentTime', 'set');
    const remote = new MediaRemoteControl(provider);

    provider.mediaQueue.start();
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

    provider.mediaQueue.start();

    expect(volumeSpy).not.toHaveBeenCalled();

    remote.changeVolume(0.5);
    expect(volumeSpy).toHaveBeenCalledWith(0.5);
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
