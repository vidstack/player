import '../vds-player';
import { expect, fixture, html } from '@open-wc/testing';
import { Player } from '../Player';
import {
  switchToDesktopDevice,
  switchToMobileDevice,
  useKeyboardInputDevice,
  useMouseInputDevice,
  useTouchInputDevice,
} from './helpers';
import { Device, InputDevice } from '../../utils/dom';
import { playerContext } from '../player.context';
import {
  MediaType,
  PlayerState,
  ReadonlyPlayerState,
  ViewType,
  WritablePlayerState,
} from '../player.types';
import { FakeConsumer } from './FakeConsumer';

describe('device change', () => {
  it('should when screen size <= mobile max width', async () => {
    const player = await fixture<Player>(html`<vds-player></vds-player>`);
    const { detail } = await switchToMobileDevice(player);
    const expectedDevice = Device.Mobile;
    expect(detail).to.equal(expectedDevice);
    expect(player.device).to.equal(expectedDevice);
    expect(player.isMobileDevice).to.be.true;
    expect(player.isDesktopDevice).to.be.false;
    expect(player).to.have.attribute('mobile', 'true');
    expect(player).to.not.have.attribute('desktop', 'true');
  });

  it('should when screen size > mobile max width', async () => {
    const player = await fixture<Player>(html`<vds-player></vds-player>`);
    const { detail } = await switchToDesktopDevice(player);
    const expectedDevice = Device.Desktop;
    expect(detail).to.equal(expectedDevice);
    expect(player.device).to.equal(expectedDevice);
    expect(player.isMobileDevice).to.be.false;
    expect(player.isDesktopDevice).to.be.true;
    expect(player).to.have.attribute('desktop', 'true');
    expect(player).to.not.have.attribute('mobile', 'true');
  });
});

describe('input device change', () => {
  it('should update when screen is touched', async () => {
    const player = await fixture<Player>(html`<vds-player></vds-player>`);
    const { detail } = await useTouchInputDevice(player);
    const expectedInputDevice = InputDevice.Touch;
    expect(detail).to.be.equal(expectedInputDevice);
    expect(player.inputDevice).to.equal(expectedInputDevice);
    expect(player.isTouchInputDevice).to.be.true;
    expect(player.isMouseInputDevice).to.be.false;
    expect(player.isKeyboardInputDevice).to.be.false;
    expect(player).to.have.attribute('touch', 'true');
    expect(player).to.not.have.attribute('mouse', 'true');
    expect(player).to.not.have.attribute('keyboard', 'true');
  });

  it('should update mouse is moved', async () => {
    const player = await fixture<Player>(html`<vds-player></vds-player>`);
    const { detail } = await useMouseInputDevice(player);
    const expectedInputDevice = InputDevice.Mouse;
    expect(detail).to.be.equal(expectedInputDevice);
    expect(player.inputDevice).to.equal(expectedInputDevice);
    expect(player.isTouchInputDevice).to.be.false;
    expect(player.isMouseInputDevice).to.be.true;
    expect(player.isKeyboardInputDevice).to.be.false;
    expect(player).to.have.attribute('mouse', 'true');
    expect(player).to.not.have.attribute('touch', 'true');
    expect(player).to.not.have.attribute('keyboard', 'true');
  });

  it('should update when keyboard is used', async () => {
    const player = await fixture<Player>(html`<vds-player></vds-player>`);
    const { detail } = await useKeyboardInputDevice(player);
    const expectedInputDevice = InputDevice.Keyboard;
    expect(detail).to.be.equal(expectedInputDevice);
    expect(player.inputDevice).to.equal(expectedInputDevice);
    expect(player.isTouchInputDevice).to.be.false;
    expect(player.isMouseInputDevice).to.be.false;
    expect(player.isKeyboardInputDevice).to.be.true;
    expect(player).to.have.attribute('keyboard', 'true');
    expect(player).to.not.have.attribute('touch', 'true');
    expect(player).to.not.have.attribute('mouse', 'true');
  });
});

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
});

describe('context', () => {
  it('should have defined all context properties', async () => {
    const player = await fixture<Player>(html`<vds-player></vds-player>`);

    Object.keys(playerContext).forEach(prop => {
      const ctxProp = `${prop}Ctx`;
      const descriptor = Object.getOwnPropertyDescriptor(
        player.constructor.prototype,
        ctxProp,
      );
      expect(
        descriptor?.get && descriptor?.set,
        `Expected context property [${ctxProp}] to be defined.`,
      ).to.exist;
    });
  });

  it('should update context consumers', async () => {
    const player = await fixture<Player>(
      html`
        <vds-player>
          <vds-fake-consumer></vds-fake-consumer>
        </vds-player>
      `,
    );

    // TODO: slot not rendering for some reason? [WIP]
    // const consumer = player.shadowRoot?.querySelector('vds-fake-consumer') as FakeConsumer;
    // console.log(player.shadowRoot?.innerHTML);
  });

  // src/aspectRatio
});

describe('events', () => {
  // emitted?
});

describe('user events', () => {
  // handled?
  // allow pass through
});

describe('provider events', () => {
  // handled? translated?
  // viewtype attrs
  // allow pass through
});

describe('render', () => {
  // aria-check
  // render snapshot
  // isblocker render
  // audio/video classes
  // aspect ratio updates
});
