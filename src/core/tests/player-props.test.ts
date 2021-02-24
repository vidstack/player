import '../vds-player';
import '../provider/vds-mock-media-provider';
import { expect, fixture, html } from '@open-wc/testing';
import { Device } from '../../utils';
import { Player } from '../Player';
import { playerContext } from '../player.context';
import {
  MediaType,
  PlayerContextProvider,
  PlayerState,
  ReadonlyPlayerState,
  ViewType,
  WritablePlayerState,
} from '../player.types';
import { buildPlayerWithMockProvider } from './helpers';
import sinon, { spy } from 'sinon';

describe('props', async () => {
  afterEach(() => {
    sinon.reset();
  });

  const player = await fixture<Player>(html`<vds-player></vds-player>`);

  it('should have defined all player state props', () => {
    ((Object.keys(playerContext) as unknown) as (keyof PlayerState)[]).forEach(
      prop => {
        if (prop !== 'uuid') {
          expect(player[prop]).to.equal(playerContext[prop].defaultValue);
        }
      },
    );
  });

  it('should have defined readonly properties as readonly', async () => {
    // Values here are irrelevant - used an object to force defining all properties.
    const readonlyProperties: ReadonlyPlayerState = {
      uuid: '',
      duration: 0,
      buffered: 0,
      device: Device.Mobile,
      isMobileDevice: false,
      isDesktopDevice: false,
      isBuffering: false,
      isPlaying: false,
      hasPlaybackStarted: false,
      hasPlaybackEnded: false,
      isProviderReady: false,
      isPlaybackReady: false,
      viewType: ViewType.Unknown,
      isAudioView: false,
      isVideoView: false,
      mediaType: MediaType.Unknown,
      isAudio: false,
      isVideo: false,
    };

    const player = await fixture<Player>(html`<vds-player></vds-player>`);

    Object.keys(readonlyProperties).forEach(prop => {
      const descriptor = Object.getOwnPropertyDescriptor(
        player.constructor.prototype,
        prop,
      );
      expect(
        descriptor?.set,
        `Expected readonly property [${prop}] to not have setter.`,
      ).to.be.undefined;
    });
  });

  it('should have defined writable properties as writable', async () => {
    // Values here are irrelevant - used an object to force defining all properties.
    const writableProperties: WritablePlayerState = {
      volume: 0,
      currentTime: 0,
      poster: '',
      muted: false,
      aspectRatio: '',
      paused: false,
      controls: false,
    };

    const player = await fixture<Player>(html`<vds-player></vds-player>`);

    Object.keys(writableProperties).forEach(prop => {
      const descriptor = Object.getOwnPropertyDescriptor(
        player.constructor.prototype,
        prop,
      );

      expect(
        descriptor?.set,
        `Expected writable property [${prop}] to have a setter.`,
      ).to.exist;
    });
  });

  it('should handle aspect ratio change through setter', async () => {
    const player = await fixture<Player>(html`<vds-player></vds-player>`);
    const provider = (player as unknown) as PlayerContextProvider;
    const newAspectRatio = '20:100';
    player.aspectRatio = newAspectRatio;
    expect(player.aspectRatio).to.equal(newAspectRatio);
    expect(provider.aspectRatioCtx).to.equal(newAspectRatio);
  });

  it('should update provider when volume is set', async () => {
    const [player, provider] = await buildPlayerWithMockProvider();
    const volume = 0.75;
    const mspy = spy(provider, 'setVolume');
    player.volume = volume;
    expect(mspy).to.have.been.calledWith(volume);
  });

  it('should update provider when currentTime is set', async () => {
    const [player, provider] = await buildPlayerWithMockProvider();
    const currentTime = 420;
    const mspy = spy(provider, 'setCurrentTime');
    player.currentTime = currentTime;
    expect(mspy).to.have.been.calledWith(currentTime);
  });

  it('should update provider when paused is set', async () => {
    const [player, provider] = await buildPlayerWithMockProvider();
    const paused = false;
    const mspy = spy(provider, 'pause');
    player.paused = paused;
    expect(mspy).to.have.been.calledOnce;
  });

  it('should update provider when controls is set', async () => {
    const [player, provider] = await buildPlayerWithMockProvider();
    const controls = false;
    const mspy = spy(provider, 'setControlsVisibility');
    player.controls = controls;
    expect(mspy).to.have.been.calledWith(controls);
  });

  it('should update provider when poster is set', async () => {
    const [player, provider] = await buildPlayerWithMockProvider();
    const poster = 'koala';
    const mspy = spy(provider, 'setPoster');
    player.poster = poster;
    expect(mspy).to.have.been.calledWith(poster);
  });

  it('should update provider when muted is set', async () => {
    const [player, provider] = await buildPlayerWithMockProvider();
    const muted = true;
    const mspy = spy(provider, 'setMuted');
    player.muted = muted;
    expect(mspy).to.have.been.calledWith(muted);
  });
});
