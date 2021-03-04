import '../../fakes/vds-fake-media-provider';

import { expect, oneEvent } from '@open-wc/testing';

import { buildFakeMediaProvider, emitEvent } from '../../fakes/helpers';
import { MediaType } from '../../MediaType';
import {
  DisconnectEvent,
  MediaTypeChangeEvent,
  SrcChangeEvent,
} from '../../player.events';

describe('media type mixin', () => {
  it('should update media type when media type change event is fired [audio]', async () => {
    const provider = await buildFakeMediaProvider();
    emitEvent(provider, new MediaTypeChangeEvent({ detail: MediaType.Audio }));
    await oneEvent(provider, MediaTypeChangeEvent.TYPE);
    expect(provider.mediaType).to.equal(MediaType.Audio);
    expect(provider.isAudio).to.be.true;
    expect(provider.isVideo).to.be.false;
  });

  it('should update media type when media type change event is fired [video]', async () => {
    const provider = await buildFakeMediaProvider();
    emitEvent(provider, new MediaTypeChangeEvent({ detail: MediaType.Video }));
    await oneEvent(provider, MediaTypeChangeEvent.TYPE);
    expect(provider.mediaType).to.equal(MediaType.Video);
    expect(provider.isAudio).to.be.false;
    expect(provider.isVideo).to.be.true;
  });

  it('should update media type when media type change event is fired [unknown]', async () => {
    const provider = await buildFakeMediaProvider();
    emitEvent(
      provider,
      new MediaTypeChangeEvent({ detail: MediaType.Unknown }),
    );
    await oneEvent(provider, MediaTypeChangeEvent.TYPE);
    expect(provider.mediaType).to.equal(MediaType.Unknown);
    expect(provider.isAudio).to.be.false;
    expect(provider.isVideo).to.be.false;
  });

  it('should reset when src change event is fired', async () => {
    const provider = await buildFakeMediaProvider();
    emitEvent(provider, new MediaTypeChangeEvent({ detail: MediaType.Video }));
    await oneEvent(provider, MediaTypeChangeEvent.TYPE);
    emitEvent(provider, new SrcChangeEvent({ detail: '' }));
    await oneEvent(provider, SrcChangeEvent.TYPE);
    expect(provider.mediaType).to.equal(MediaType.Unknown);
    expect(provider.isAudio).to.be.false;
    expect(provider.isVideo).to.be.false;
  });

  it('should reset when disconnected event is fired', async () => {
    const provider = await buildFakeMediaProvider();
    emitEvent(provider, new MediaTypeChangeEvent({ detail: MediaType.Video }));
    await oneEvent(provider, MediaTypeChangeEvent.TYPE);
    emitEvent(provider, new DisconnectEvent({ detail: provider }));
    await oneEvent(provider, DisconnectEvent.TYPE);
    expect(provider.mediaType).to.equal(MediaType.Unknown);
    expect(provider.isAudio).to.be.false;
    expect(provider.isVideo).to.be.false;
  });
});
