import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import { spy, stub } from 'sinon';

import { FakeMediaProvider } from '../../fakes/FakeMediaProvider';
import { emitEvent } from '../../fakes/helpers';
import {
  UserMutedChangeRequestEvent,
  UserPauseRequestEvent,
  UserPlayRequestEvent,
  UserTimeChangeRequestEvent,
  UserVolumeChangeRequestEvent,
} from '../user.events';

describe('user events', () => {
  let container: HTMLDivElement;
  let provider: FakeMediaProvider;
  let user: HTMLDivElement;

  beforeEach(async () => {
    container = await fixture<HTMLDivElement>(html`
      <div>
        <vds-fake-media-provider>
          <div></div>
        </vds-fake-media-provider>
      </div>
    `);

    provider = container.firstElementChild as FakeMediaProvider;
    user = provider.firstElementChild as HTMLDivElement;
  });

  async function dispatchUserRequest(e: Event) {
    emitEvent(user, e);
  }

  it('should request provider to play when user play request is received', async () => {
    const playSpy = spy(provider, 'play');
    stub(provider, 'isPlaybackReady').get(() => true);
    dispatchUserRequest(new UserPlayRequestEvent());
    await oneEvent(provider, UserPlayRequestEvent.TYPE);
    expect(playSpy).to.have.been.calledOnce;
  });

  it('should request provider to pause when user pause request is received', async () => {
    const pauseSpy = spy(provider, 'pause');
    stub(provider, 'isPlaybackReady').get(() => true);
    dispatchUserRequest(new UserPauseRequestEvent());
    await oneEvent(provider, UserPauseRequestEvent.TYPE);
    expect(pauseSpy).to.have.been.calledOnce;
  });

  it('should request provider to mute when user mute request is received', async () => {
    const mutedSpy = spy(provider, 'setMuted');
    stub(provider, 'isPlaybackReady').get(() => true);
    dispatchUserRequest(new UserMutedChangeRequestEvent({ detail: true }));
    await oneEvent(provider, UserMutedChangeRequestEvent.TYPE);
    expect(mutedSpy).to.have.been.calledOnceWith(true);
  });

  it('should request provider to change volume when user volume change request is received', async () => {
    const volumeSpy = spy(provider, 'setVolume');
    stub(provider, 'isPlaybackReady').get(() => true);
    dispatchUserRequest(new UserVolumeChangeRequestEvent({ detail: 0.83 }));
    await oneEvent(provider, UserVolumeChangeRequestEvent.TYPE);
    expect(volumeSpy).to.have.been.calledOnceWith(0.83);
  });

  it('should request provider to change time when user time change request is received', async () => {
    const currentTimeSpy = spy(provider, 'setCurrentTime');
    stub(provider, 'isPlaybackReady').get(() => true);
    dispatchUserRequest(new UserTimeChangeRequestEvent({ detail: 23 }));
    await oneEvent(provider, UserTimeChangeRequestEvent.TYPE);
    expect(currentTimeSpy).to.have.been.calledOnceWith(23);
  });

  it('should prevent user events from bubbling by default', async () => {
    const callback = spy();
    container.addEventListener(UserPlayRequestEvent.TYPE, callback);

    dispatchUserRequest(new UserPlayRequestEvent());
    await oneEvent(provider, UserPlayRequestEvent.TYPE);

    expect(callback).to.not.have.been.called;
  });

  it('should allow user events to bubble', async () => {
    const callback = spy();

    provider.allowUserEventsToBubble = true;
    container.addEventListener(UserPlayRequestEvent.TYPE, callback);

    dispatchUserRequest(new UserPlayRequestEvent());
    await oneEvent(container, UserPlayRequestEvent.TYPE);

    expect(callback).to.have.been.called;
  });
});
