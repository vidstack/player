import '../vds-player';
import { elementUpdated, expect, fixture, html } from '@open-wc/testing';
import { Device, InputDevice } from '../../utils/dom';
import { Player } from '../Player';
import {
  switchToDesktopDevice,
  switchToMobileDevice,
  useKeyboardInputDevice,
  useMouseInputDevice,
  useTouchInputDevice,
} from './helpers';
import { PlayerContextProvider } from '../player.types';

describe('render', () => {
  it('should set aria busy to true if not ready for playback', async () => {
    const player = await fixture<Player>(html`<vds-player></vds-player>`);
    const root = player.shadowRoot?.firstElementChild as HTMLDivElement;
    expect(root).to.have.attribute('aria-busy', 'true');
  });

  it('should set aria busy to false if ready for playback', async () => {
    // const player = await fixture<Player>(html`<vds-player></vds-player>`);
    // TODO: test once mock media provider is ready.
  });

  it('should not render blocker given not a video view and controls are off', async () => {
    const player = await fixture<Player>(html`<vds-player></vds-player>`);
    player.controls = false;
    await elementUpdated(player);
    const root = player.shadowRoot?.firstElementChild as HTMLDivElement;
    const blocker = root.querySelector('provider-ui-blocker');
    expect(blocker).to.be.null;
  });

  it('should render blocker', async () => {
    // const player = await fixture<Player>(html`<vds-player></vds-player>`);
    // const root = player.shadowRoot?.firstElementChild as HTMLDivElement;
    // TODO: test once mock media provider is ready.
  });

  it('should set audio class given view change to audio view', async () => {
    // const player = await fixture<Player>(html`<vds-player></vds-player>`);
    // const root = player.shadowRoot?.firstElementChild as HTMLDivElement;
    // TODO: test once mock media provider is ready.
  });

  it('should set video class given view change to video view', async () => {
    // const player = await fixture<Player>(html`<vds-player></vds-player>`);
    // const root = player.shadowRoot?.firstElementChild as HTMLDivElement;
    // TODO: test once mock media provider is ready.
  });

  it('should set bottom padding given valid aspect ratio', async () => {
    const player = await fixture<Player>(html`<vds-player></vds-player>`);
    // const root = player.shadowRoot?.firstElementChild as HTMLDivElement;
    player.aspectRatio = '4:3';
    // TODO: test once mock media provider is ready.
  });

  it('should set bottom padding to 16:9 given invalid aspect ratio', async () => {
    const player = await fixture<Player>(html`<vds-player></vds-player>`);
    // const root = player.shadowRoot?.firstElementChild as HTMLDivElement;
    player.aspectRatio = 'tasmanian devil';
    // TODO: test once mock media provider is ready.
  });
});

describe('device change', () => {
  it('should update when screen size <= mobile max width', async () => {
    const player = await fixture<Player>(html`<vds-player></vds-player>`);
    const provider = (player as unknown) as PlayerContextProvider;
    const { detail } = await switchToMobileDevice(player);
    const expectedDevice = Device.Mobile;
    expect(detail).to.equal(expectedDevice);
    expect(player.device).to.equal(expectedDevice);
    expect(player.isMobileDevice).to.be.true;
    expect(player.isDesktopDevice).to.be.false;
    expect(provider.isMobileDeviceCtx).to.be.true;
    expect(provider.isDesktopDeviceCtx).to.be.false;
    expect(player).to.have.attribute('mobile', 'true');
    expect(player).to.not.have.attribute('desktop', 'true');
  });

  it('should update when screen size > mobile max width', async () => {
    const player = await fixture<Player>(html`<vds-player></vds-player>`);
    const provider = (player as unknown) as PlayerContextProvider;
    const { detail } = await switchToDesktopDevice(player);
    const expectedDevice = Device.Desktop;
    expect(detail).to.equal(expectedDevice);
    expect(player.device).to.equal(expectedDevice);
    expect(player.isMobileDevice).to.be.false;
    expect(player.isDesktopDevice).to.be.true;
    expect(provider.isMobileDeviceCtx).to.be.false;
    expect(provider.isDesktopDeviceCtx).to.be.true;
    expect(player).to.have.attribute('desktop', 'true');
    expect(player).to.not.have.attribute('mobile', 'true');
  });
});

describe('input device change', () => {
  it('should update when screen is touched', async () => {
    const player = await fixture<Player>(html`<vds-player></vds-player>`);
    const provider = (player as unknown) as PlayerContextProvider;
    const { detail } = await useTouchInputDevice(player);
    const expectedInputDevice = InputDevice.Touch;
    expect(detail).to.be.equal(expectedInputDevice);
    expect(player.inputDevice).to.equal(expectedInputDevice);
    expect(player.isTouchInputDevice).to.be.true;
    expect(player.isMouseInputDevice).to.be.false;
    expect(player.isKeyboardInputDevice).to.be.false;
    expect(provider.isTouchInputDeviceCtx).to.be.true;
    expect(provider.isMouseInputDeviceCtx).to.be.false;
    expect(provider.isKeyboardInputDeviceCtx).to.be.false;
    expect(player).to.have.attribute('touch', 'true');
    expect(player).to.not.have.attribute('mouse', 'true');
    expect(player).to.not.have.attribute('keyboard', 'true');
  });

  it('should update mouse is moved', async () => {
    const player = await fixture<Player>(html`<vds-player></vds-player>`);
    const provider = (player as unknown) as PlayerContextProvider;
    const { detail } = await useMouseInputDevice(player);
    const expectedInputDevice = InputDevice.Mouse;
    expect(detail).to.be.equal(expectedInputDevice);
    expect(player.inputDevice).to.equal(expectedInputDevice);
    expect(player.isTouchInputDevice).to.be.false;
    expect(player.isMouseInputDevice).to.be.true;
    expect(player.isKeyboardInputDevice).to.be.false;
    expect(provider.isTouchInputDeviceCtx).to.be.false;
    expect(provider.isMouseInputDeviceCtx).to.be.true;
    expect(provider.isKeyboardInputDeviceCtx).to.be.false;
    expect(player).to.have.attribute('mouse', 'true');
    expect(player).to.not.have.attribute('touch', 'true');
    expect(player).to.not.have.attribute('keyboard', 'true');
  });

  it('should update when keyboard is used', async () => {
    const player = await fixture<Player>(html`<vds-player></vds-player>`);
    const provider = (player as unknown) as PlayerContextProvider;
    const { detail } = await useKeyboardInputDevice(player);
    const expectedInputDevice = InputDevice.Keyboard;
    expect(detail).to.be.equal(expectedInputDevice);
    expect(player.inputDevice).to.equal(expectedInputDevice);
    expect(player.isTouchInputDevice).to.be.false;
    expect(player.isMouseInputDevice).to.be.false;
    expect(player.isKeyboardInputDevice).to.be.true;
    expect(provider.isTouchInputDeviceCtx).to.be.false;
    expect(provider.isMouseInputDeviceCtx).to.be.false;
    expect(provider.isKeyboardInputDeviceCtx).to.be.true;
    expect(player).to.have.attribute('keyboard', 'true');
    expect(player).to.not.have.attribute('touch', 'true');
    expect(player).to.not.have.attribute('mouse', 'true');
  });
});
