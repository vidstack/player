/* eslint-disable @typescript-eslint/no-non-null-assertion */
import '../vds-player';
import '../provider/vds-mock-media-provider';
import { elementUpdated, expect, fixture, html } from '@open-wc/testing';
import { Device } from '../../utils';
import { Player } from '../Player';
import {
  buildPlayerWithMockProvider,
  switchToDesktopDevice,
  switchToMobileDevice,
} from './helpers';
import { PlayerContextProvider, ViewType } from '../player.types';
import sinon, { stub } from 'sinon';

describe('render', () => {
  afterEach(() => {
    sinon.reset();
  });

  it('should set aria busy to true if not ready for playback', async () => {
    const player = await fixture<Player>(html`<vds-player></vds-player>`);
    const root = player.shadowRoot?.firstElementChild as HTMLDivElement;
    expect(root).to.have.attribute('aria-busy', 'true');
  });

  it('should set aria busy to false if ready for playback', async () => {
    const [player, provider] = await buildPlayerWithMockProvider();

    stub(provider, 'isPlaybackReady').returns(true);
    await player.requestUpdate();

    const root = player.shadowRoot?.firstElementChild as HTMLDivElement;
    expect(root).to.have.attribute('aria-busy', 'false');
  });

  it('should not render blocker given not a video view and controls are off', async () => {
    const player = await fixture<Player>(html`<vds-player></vds-player>`);
    player.controls = false;
    await elementUpdated(player);
    const root = player.shadowRoot?.firstElementChild as HTMLDivElement;
    const blocker = root.querySelector('provider-ui-blocker');
    expect(blocker).to.be.null;
  });

  it('should set audio class given view change to audio view', async () => {
    const [player, provider] = await buildPlayerWithMockProvider();

    stub(provider, 'isPlaybackReady').returns(true);
    stub(provider, 'getViewType').returns(ViewType.Audio);
    await player.requestUpdate();

    const root = player.shadowRoot?.firstElementChild as HTMLDivElement;
    expect(root).to.have.class('audio');
    expect(root).to.not.have.class('video');
  });

  it('should set video class given view change to video view', async () => {
    const [player, provider] = await buildPlayerWithMockProvider();

    stub(provider, 'isPlaybackReady').returns(true);
    stub(provider, 'getViewType').returns(ViewType.Video);
    await player.requestUpdate();

    const root = player.shadowRoot?.firstElementChild as HTMLDivElement;
    expect(root).to.have.class('video');
    expect(root).to.not.have.class('audio');
  });

  // TODO: why is this test disconnecting player from DOM early?
  it.skip('should set bottom padding given valid aspect ratio', async () => {
    const [player, provider] = await buildPlayerWithMockProvider();

    stub(provider, 'getViewType').returns(ViewType.Video);
    player.aspectRatio = '4:3';
    await player.updateComplete;

    const root = player.shadowRoot?.firstElementChild as HTMLDivElement;
    expect(root.style.paddingBottom).to.equal('75%');
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
