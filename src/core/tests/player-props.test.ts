import '../vds-player';
import '../provider/vds-mock-media-provider';

import { expect, fixture, html } from '@open-wc/testing';
import sinon, { spy, stub } from 'sinon';

import { Player } from '../Player';
import { playerContext } from '../player.context';
import {
  MediaType,
  PlayerContext,
  PlayerContextProvider,
  PlayerState,
  ReadonlyPlayerState,
  ViewType,
  WritablePlayerState,
} from '../player.types';
import { buildPlayerWithMockProvider } from './helpers';

describe('props', async () => {
  afterEach(() => {
    sinon.reset();
  });

  const player = await fixture<Player>(html`<vds-player></vds-player>`);

  it('should have defined all player state props', () => {
    ((Object.keys(
      playerContext,
    ) as unknown) as (keyof PlayerContext)[]).forEach(prop => {
      // Skip uuid because it generates a value as the component mounts.
      if (prop === 'uuid') return;
      expect(player[prop], prop).to.equal(playerContext[prop].defaultValue);
    });
  });

  it('should have defined readonly properties as readonly', async () => {
    // Values here are irrelevant - using an object to force defining all properties.
    const readonlyProperties: ReadonlyPlayerState = {
      currentSrc: '',
      currentPoster: '',
      duration: 0,
      buffered: 0,
      isBuffering: false,
      isPlaying: false,
      hasPlaybackStarted: false,
      hasPlaybackEnded: false,
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
    // Values here are irrelevant - using an object to force defining all properties.
    const writableProperties: WritablePlayerState = {
      volume: 0,
      currentTime: 0,
      muted: false,
      aspectRatio: '',
      paused: false,
      controls: false,
    };

    const player = await fixture<Player>(html`<vds-player></vds-player>`);

    Object.keys(writableProperties).forEach(prop => {
      // Defined in mixin.
      if (prop === 'aspectRatio') return;

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
    const volumeSpy = spy(provider, 'volume', ['set']);
    stub(provider, 'isPlaybackReady').get(() => true);
    player.volume = volume;
    expect(volumeSpy.set).to.have.been.calledWith(volume);
  });

  it('should update provider when currentTime is set', async () => {
    const [player, provider] = await buildPlayerWithMockProvider();
    const currentTime = 420;
    const currentTimeSpy = spy(provider, 'currentTime', ['set']);
    stub(provider, 'isPlaybackReady').get(() => true);
    player.currentTime = currentTime;
    expect(currentTimeSpy.set).to.have.been.calledWith(currentTime);
  });

  it('should update provider when paused is set', async () => {
    const [player, provider] = await buildPlayerWithMockProvider();
    const paused = false;
    const playSpy = spy(provider, 'play');
    stub(provider, 'isPlaybackReady').get(() => true);
    player.paused = paused;
    expect(playSpy).to.have.been.calledOnce;
  });

  it('should update provider when controls is set', async () => {
    const [player, provider] = await buildPlayerWithMockProvider();
    const controls = false;
    const controlsSpy = spy(provider, 'controls', ['set']);
    stub(provider, 'isPlaybackReady').get(() => true);
    player.controls = controls;
    expect(controlsSpy.set).to.have.been.calledWith(controls);
  });

  it('should update provider when muted is set', async () => {
    const [player, provider] = await buildPlayerWithMockProvider();
    const muted = true;
    const mutedSpy = spy(provider, 'muted', ['set']);
    stub(provider, 'isPlaybackReady').get(() => true);
    player.muted = muted;
    expect(mutedSpy.set).to.have.been.calledWith(muted);
  });
});
