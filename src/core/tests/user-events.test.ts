import '../vds-player';
import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import { spy } from 'sinon';
import {
  UserMutedChangeRequestEvent,
  UserPauseRequestEvent,
  UserPlayRequestEvent,
  UserTimeChangeRequestEvent,
  UserVolumeChangeRequestEvent,
} from '../user';
import { Player } from '../Player';

describe('user events', () => {
  let container: HTMLDivElement;
  let player: Player;
  let child: HTMLDivElement;

  beforeEach(async () => {
    container = await fixture<HTMLDivElement>(html`
      <div>
        <vds-player>
          <div></div>
        </vds-player>
      </div>
    `);

    player = container.firstElementChild as Player;
    child = player.firstElementChild as HTMLDivElement;
  });

  async function makeUserRequest(e: Event) {
    child.dispatchEvent(e);
  }

  it('should request provider to play when user play request is received', async () => {
    makeUserRequest(new UserPlayRequestEvent());
    // TODO: test once a mock provider is ready.
  });

  it('should request provider to pause when user pause request is received', () => {
    makeUserRequest(new UserPauseRequestEvent());
    // TODO: test once a mock provider is ready.
  });

  it('should request provider to mute when user mute request is received', () => {
    makeUserRequest(new UserMutedChangeRequestEvent({ detail: true }));
    // TODO: test once a mock provider is ready.
  });

  it('should request provider to change volume when user volume change request is received', () => {
    makeUserRequest(new UserVolumeChangeRequestEvent({ detail: 0.75 }));
    // TODO: test once a mock provider is ready.
  });

  it('should request provider to change time when user time change request is received', () => {
    makeUserRequest(new UserTimeChangeRequestEvent({ detail: 25 }));
    // TODO: test once a mock provider is ready.ja
  });

  it('should prevent user events from bubbling by default', async () => {
    const callback = spy();
    container.addEventListener(UserPlayRequestEvent.TYPE, callback);

    setTimeout(() => makeUserRequest(new UserPlayRequestEvent()));
    await oneEvent(player, UserPlayRequestEvent.TYPE);

    expect(callback).to.not.have.been.called;
  });

  it('should allow user events to bubble', async () => {
    const callback = spy();

    player.allowUserEventsToBubble = true;
    container.addEventListener(UserPlayRequestEvent.TYPE, callback);

    setTimeout(() => makeUserRequest(new UserPlayRequestEvent()));
    await oneEvent(container, UserPlayRequestEvent.TYPE);

    expect(callback).to.have.been.called;
  });
});
