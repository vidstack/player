import '../../fakes/vds-fake-media-provider';

import { expect, oneEvent } from '@open-wc/testing';

import { buildFakeMediaProvider, emitEvent } from '../../fakes/helpers';
import { DisconnectEvent, ViewTypeChangeEvent } from '../../player.events';
import { ViewType } from '../../ViewType';

describe('view type mixin', () => {
  it('should update view type when view type change event is fired [audio]', async () => {
    const provider = await buildFakeMediaProvider();
    emitEvent(provider, new ViewTypeChangeEvent({ detail: ViewType.Audio }));
    await oneEvent(provider, ViewTypeChangeEvent.TYPE);
    expect(provider.viewType).to.equal(ViewType.Audio);
    expect(provider.isAudioView).to.be.true;
    expect(provider.isVideoView).to.be.false;
  });

  it('should update view type when view type change event is fired [video]', async () => {
    const provider = await buildFakeMediaProvider();
    emitEvent(provider, new ViewTypeChangeEvent({ detail: ViewType.Video }));
    await oneEvent(provider, ViewTypeChangeEvent.TYPE);
    expect(provider.viewType).to.equal(ViewType.Video);
    expect(provider.isAudioView).to.be.false;
    expect(provider.isVideoView).to.be.true;
  });

  it('should update view type when view type change event is fired [unknown]', async () => {
    const provider = await buildFakeMediaProvider();
    emitEvent(provider, new ViewTypeChangeEvent({ detail: ViewType.Unknown }));
    await oneEvent(provider, ViewTypeChangeEvent.TYPE);
    expect(provider.viewType).to.equal(ViewType.Unknown);
    expect(provider.isAudioView).to.be.false;
    expect(provider.isVideoView).to.be.false;
  });

  it('should reset when disconnected event is fired', async () => {
    const provider = await buildFakeMediaProvider();
    emitEvent(provider, new ViewTypeChangeEvent({ detail: ViewType.Video }));
    await oneEvent(provider, ViewTypeChangeEvent.TYPE);
    emitEvent(provider, new DisconnectEvent({ detail: provider }));
    await oneEvent(provider, DisconnectEvent.TYPE);
    expect(provider.viewType).to.equal(ViewType.Unknown);
    expect(provider.isAudioView).to.be.false;
    expect(provider.isVideoView).to.be.false;
  });
});
