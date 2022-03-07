import '../../../define/vds-fake-media-provider';

import { elementUpdated, fixture } from '@open-wc/testing-helpers';

import { waitForEvent } from '../../../utils/events';
import { isFunction } from '../../../utils/unit';
import { FakeMediaProviderElement } from '../../test-utils';
import { MediaProviderElement } from '../MediaProviderElement';

async function buildFixture() {
  const provider = await fixture<FakeMediaProviderElement>(
    `<vds-fake-media-provider></vds-fake-media-provider>`
  );

  return { provider };
}

test('light DOM snapshot', async function () {
  const { provider } = await buildFixture();
  expect(provider).dom.to.equal(`
    <vds-fake-media-provider></vds-fake-media-provider>
  `);
});

test('shadow DOM snapshot', async function () {
  const { provider } = await buildFixture();
  expect(provider).shadowDom.to.equal('<slot></slot>');
});

test('it should dispatch discovery event once connected', async function () {
  const provider = document.createElement('vds-fake-media-provider');

  setTimeout(() => {
    window.document.body.append(provider);
  });

  const { detail } = await waitForEvent(provider, 'vds-media-provider-connect');

  expect(detail.element).to.be.instanceOf(MediaProviderElement);
  expect(isFunction(detail.onDisconnect)).to.be.true;
});

test('it should update volume', async function () {
  const { provider } = await buildFixture();
  const volume = 0.75;
  const volumeSpy = vi.spyOn(provider, '_setVolume');
  await provider.mediaRequestQueue.start();
  provider.volume = volume;
  expect(volumeSpy).toHaveBeenCalledWith(volume);
});

test('it should update currentTime', async function () {
  const { provider } = await buildFixture();
  const currentTime = 420;
  const currentTimeSpy = vi.spyOn(provider, '_setCurrentTime');
  await provider.mediaRequestQueue.start();
  provider.currentTime = currentTime;
  expect(currentTimeSpy).toHaveBeenCalledWith(currentTime);
});

test('it should update paused', async function () {
  const { provider } = await buildFixture();
  const playSpy = vi.spyOn(provider, 'play');
  const pauseSpy = vi.spyOn(provider, 'pause');
  await provider.mediaRequestQueue.start();
  provider.paused = false;
  expect(playSpy).toHaveBeenCalledOnce();
  provider.paused = true;
  expect(pauseSpy).toHaveBeenCalledOnce();
});

test('it should update muted', async function () {
  const { provider } = await buildFixture();
  const mutedSpy = vi.spyOn(provider, '_setMuted');
  await provider.mediaRequestQueue.start();
  provider.muted = true;
  expect(mutedSpy).toHaveBeenCalledWith(true);
});

describe('media request queue', function () {
  test('it should queue request given media is not ready and flush once ready', async function () {
    const { provider } = await buildFixture();

    const volumeSpy = vi.spyOn(provider, '_setVolume');

    // Queue.
    provider.volume = 0.53;
    expect(provider.mediaRequestQueue.size, 'queue size').to.equal(1);

    // Flush.
    await provider.mediaRequestQueue.start();

    // Check.
    expect(provider.mediaRequestQueue.size, 'new queue size').to.equal(0);
    expect(volumeSpy).toHaveBeenCalledWith(0.53);
  });

  test('it should make request immediately if media is ready', async function () {
    const { provider } = await buildFixture();

    const volumeSpy = vi.spyOn(provider, '_setVolume');

    await provider.mediaRequestQueue.start();

    provider.volume = 0.53;

    await elementUpdated(provider);

    expect(provider.mediaRequestQueue.size, 'queue size').to.equal(0);
    expect(volumeSpy).toHaveBeenCalledWith(0.53);
  });

  test('it should overwrite request keys and only call once per "type"', async function () {
    const { provider } = await buildFixture();

    const playSpy = vi.spyOn(provider, 'play');
    const pauseSpy = vi.spyOn(provider, 'pause');

    provider.paused = false;

    setTimeout(() => {
      provider.paused = true;
      expect(provider.mediaRequestQueue.size, 'queue size').to.equal(1);
      provider.mediaRequestQueue.start();
    });

    await provider.mediaRequestQueue.waitForFlush();

    expect(playSpy).not.toHaveBeenCalled();
    expect(pauseSpy).to.not.toHaveBeenCalled();
  });
});

describe('autoplay', function () {
  test('it should not call play if autoplay is false', async function () {
    const { provider } = await buildFixture();

    provider._store.autoplay.set(false);
    provider._store.canPlay.set(false);

    const playSpy = vi.spyOn(provider, 'play');

    await provider.attemptAutoplay();

    expect(playSpy).not.toHaveBeenCalled();
  });

  test('it should not call play if not ready for playback', async function () {
    const { provider } = await buildFixture();

    provider._store.autoplay.set(true);
    provider._store.canPlay.set(false);

    const playSpy = vi.spyOn(provider, 'play');

    await provider.attemptAutoplay();

    expect(playSpy).not.toHaveBeenCalled();
  });

  test('it should not call play if playback has started', async function () {
    const { provider } = await buildFixture();

    provider._store.autoplay.set(true);
    provider._store.canPlay.set(true);
    provider._store.started.set(true);

    const playSpy = vi.spyOn(provider, 'play');

    await provider.attemptAutoplay();

    expect(playSpy).not.toHaveBeenCalled();
  });
});
