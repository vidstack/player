import '../vds-player';
import { expect, fixture, html } from '@open-wc/testing';
import { Device, InputDevice } from '../../utils';
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

describe('props', async () => {
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
      inputDevice: InputDevice.Mouse,
      isTouchInputDevice: false,
      isMouseInputDevice: false,
      isKeyboardInputDevice: false,
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
      src: '',
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

  // TODO: once we have a MockMediaProvider - test if triggering writable prop setters calls the
  // correct method on the provider.
  it('should handle src change through settter', async () => {
    const player = await fixture<Player>(html`<vds-player></vds-player>`);
    const provider = (player as unknown) as PlayerContextProvider;
    const newSrc = 'kangaroo';
    player.src = newSrc;
    expect(player.src).to.equal(newSrc);
    expect(provider.srcCtx).to.equal(newSrc);
    // TODO: src change handled?
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
    const player = await fixture<Player>(html`<vds-player></vds-player>`);
    const volume = 0.75;
    player.volume = volume;
    // TODO: test this once a mock media provider is ready.
  });

  it('should update provider when currentTime is set', async () => {
    const player = await fixture<Player>(html`<vds-player></vds-player>`);
    const currentTime = 420;
    player.currentTime = currentTime;
    // TODO: test this once a mock media provider is ready.
  });

  it('should update provider when paused is set', async () => {
    const player = await fixture<Player>(html`<vds-player></vds-player>`);
    const paused = false;
    player.paused = paused;
    // TODO: test this once a mock media provider is ready.
  });

  it('should update provider when controls is set', async () => {
    const player = await fixture<Player>(html`<vds-player></vds-player>`);
    const controls = false;
    player.controls = controls;
    // TODO: test this once a mock media provider is ready.
  });

  it('should update provider when poster is set', async () => {
    const player = await fixture<Player>(html`<vds-player></vds-player>`);
    const poster = 'koala';
    player.poster = poster;
    // TODO: test this once a mock media provider is ready.
  });

  it('should update provider when muted is set', async () => {
    const player = await fixture<Player>(html`<vds-player></vds-player>`);
    const muted = true;
    player.muted = muted;
    // TODO: test this once a mock media provider is ready.
  });
});
