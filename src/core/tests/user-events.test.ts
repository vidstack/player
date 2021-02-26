import '../vds-player';
import '../provider/vds-mock-media-provider';
import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import { spy, stub } from 'sinon';
import {
  UserMutedChangeRequestEvent,
  UserPauseRequestEvent,
  UserPlayRequestEvent,
  UserTimeChangeRequestEvent,
  UserVolumeChangeRequestEvent,
} from '../user';
import { Player } from '../Player';
import { MockMediaProvider } from '../provider/MockMediaProvider';
import { connectProviderToPlayer, emitEvent } from './helpers';

describe('user events', () => {
  let container: HTMLDivElement;
  let player: Player;
  let provider: MockMediaProvider;

  beforeEach(async () => {
    container = await fixture<HTMLDivElement>(html`
      <div>
        <vds-player>
          <vds-mock-media-provider></vds-mock-media-provider>
        </vds-player>
      </div>
    `);

    player = container.firstElementChild as Player;
    provider = player.firstElementChild as MockMediaProvider;
    await connectProviderToPlayer(player, provider);
  });

  async function dispatchUserRequest(e: Event) {
    // Looks strange we're dispatching off the provider but it doesn't really matter.
    emitEvent(provider, e);
  }

  it('should request provider to play when user play request is received', async () => {
    const playSpy = spy(provider, 'play');
    stub(provider, 'isPlaybackReady').get(() => true);
    dispatchUserRequest(new UserPlayRequestEvent());
    await oneEvent(player, UserPlayRequestEvent.TYPE);
    expect(playSpy).to.have.been.calledOnce;
  });

  it('should request provider to pause when user pause request is received', async () => {
    const pauseSpy = spy(provider, 'pause');
    stub(provider, 'isPlaybackReady').get(() => true);
    dispatchUserRequest(new UserPauseRequestEvent());
    await oneEvent(player, UserPauseRequestEvent.TYPE);
    expect(pauseSpy).to.have.been.calledOnce;
  });

  it('should request provider to mute when user mute request is received', async () => {
    const mutedSpy = spy(provider, 'muted', ['set']);
    stub(provider, 'isPlaybackReady').get(() => true);
    dispatchUserRequest(new UserMutedChangeRequestEvent({ detail: true }));
    await oneEvent(player, UserMutedChangeRequestEvent.TYPE);
    expect(mutedSpy.set).to.have.been.calledOnceWith(true);
  });

  it('should request provider to change volume when user volume change request is received', async () => {
    const volumeSpy = spy(provider, 'volume', ['set']);
    stub(provider, 'isPlaybackReady').get(() => true);
    dispatchUserRequest(new UserVolumeChangeRequestEvent({ detail: 0.83 }));
    await oneEvent(player, UserVolumeChangeRequestEvent.TYPE);
    expect(volumeSpy.set).to.have.been.calledOnceWith(0.83);
  });

  it('should request provider to change time when user time change request is received', async () => {
    const currentTimeSpy = spy(provider, 'currentTime', ['set']);
    stub(provider, 'isPlaybackReady').get(() => true);
    dispatchUserRequest(new UserTimeChangeRequestEvent({ detail: 23 }));
    await oneEvent(player, UserTimeChangeRequestEvent.TYPE);
    expect(currentTimeSpy.set).to.have.been.calledOnceWith(23);
  });

  it('should prevent user events from bubbling by default', async () => {
    const callback = spy();
    container.addEventListener(UserPlayRequestEvent.TYPE, callback);

    dispatchUserRequest(new UserPlayRequestEvent());
    await oneEvent(player, UserPlayRequestEvent.TYPE);

    expect(callback).to.not.have.been.called;
  });

  it('should allow user events to bubble', async () => {
    const callback = spy();

    player.allowUserEventsToBubble = true;
    container.addEventListener(UserPlayRequestEvent.TYPE, callback);

    dispatchUserRequest(new UserPlayRequestEvent());
    await oneEvent(container, UserPlayRequestEvent.TYPE);

    expect(callback).to.have.been.called;
  });
});
