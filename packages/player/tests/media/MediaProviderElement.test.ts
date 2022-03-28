import '$lib/define/vds-media';
import '$lib/define/vds-fake-media-provider';

import { elementUpdated } from '@open-wc/testing-helpers';
import { isFunction, waitForEvent } from '@vidstack/foundation';

import { MediaProviderElement } from '$lib';
import { buildMediaFixture } from '$test-utils';

async function buildFixture() {
  return buildMediaFixture();
}

it('should render light DOM', async function () {
  const { provider } = await buildFixture();
  expect(provider).dom.to.equal(`
    <vds-fake-media-provider paused></vds-fake-media-provider>
  `);
});

it('should render shadow DOM', async function () {
  const { provider } = await buildFixture();
  expect(provider).shadowDom.to.equal('<slot></slot>');
});

it('it should dispatch discovery event on connect', async function () {
  const media = document.createElement('vds-media');
  const provider = document.createElement('vds-fake-media-provider');

  media.append(provider);

  setTimeout(() => {
    window.document.body.append(media);
  });

  const { detail } = await waitForEvent(provider, 'vds-media-provider-connect');

  expect(detail.element).to.be.instanceOf(MediaProviderElement);
  expect(isFunction(detail.onDisconnect)).to.be.true;
});

describe('media request queue', function () {
  it('it should queue request given media is not ready and flush once ready', async function () {
    const { provider } = await buildFixture();

    // Queue.
    provider.volume = 0.53;
    expect(provider.volume).to.equal(1);
    expect(provider.mediaQueue.size, 'queue size').to.equal(2);

    // Flush.
    provider.mediaQueue.start();

    // Check.
    expect(provider.mediaQueue.size, 'new queue size').to.equal(0);
    expect(provider.volume).to.equal(0.53);
  });

  it('it should make request immediately if media is ready', async function () {
    const { provider } = await buildFixture();

    provider.mediaQueue.start();

    provider.volume = 0.53;

    await elementUpdated(provider);

    expect(provider.mediaQueue.size, 'queue size').to.equal(0);
    expect(provider.volume).to.equal(0.53);
  });

  it('it should overwrite request keys and only call once per "type"', async function () {
    const { provider } = await buildFixture();

    const playSpy = vi.spyOn(provider, 'play');
    const pauseSpy = vi.spyOn(provider, 'pause');

    provider.paused = false;

    setTimeout(() => {
      provider.paused = true;
      expect(provider.mediaQueue.size, 'queue size').to.equal(1);
      provider.mediaQueue.start();
    });

    await provider.mediaQueue.waitForFlush();

    expect(playSpy).not.toHaveBeenCalled();
    expect(pauseSpy).to.not.toHaveBeenCalled();
  });
});
