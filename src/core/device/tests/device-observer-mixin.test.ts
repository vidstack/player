/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { expect, oneEvent } from '@open-wc/testing';
import { setViewport } from '@web/test-runner-commands';
import { spy } from 'sinon';

import {
  buildFakeMediaProvider,
  switchToDesktopDevice,
  switchToMobileDevice,
} from '../../fakes/helpers';
import { Device, onDeviceChange } from '../DeviceObserver';

describe('device mixin', () => {
  it('should update when screen size <= mobile max width', async () => {
    const provider = await buildFakeMediaProvider();
    const ctx = provider.playerContext;
    const { detail } = await switchToMobileDevice(provider);
    const expectedDevice = Device.Mobile;
    expect(detail).to.equal(expectedDevice);
    expect(provider.device).to.equal(expectedDevice);
    expect(provider.isMobileDevice).to.be.true;
    expect(provider.isDesktopDevice).to.be.false;
    expect(ctx.isMobileDeviceCtx).to.be.true;
    expect(ctx.isDesktopDeviceCtx).to.be.false;
    expect(provider).to.have.attribute('mobile', 'true');
    expect(provider).to.not.have.attribute('desktop', 'true');
  });

  it('should update when screen size > mobile max width', async () => {
    const provider = await buildFakeMediaProvider();
    const ctx = provider.playerContext;
    const { detail } = await switchToDesktopDevice(provider);
    const expectedDevice = Device.Desktop;
    expect(detail).to.equal(expectedDevice);
    expect(provider.device).to.equal(expectedDevice);
    expect(provider.isMobileDevice).to.be.false;
    expect(provider.isDesktopDevice).to.be.true;
    expect(ctx.isMobileDeviceCtx).to.be.false;
    expect(ctx.isDesktopDeviceCtx).to.be.true;
    expect(provider).to.have.attribute('desktop', 'true');
    expect(provider).to.not.have.attribute('mobile', 'true');
  });
});

describe('onDeviceChange', () => {
  it('should not call resize observer when server-side', () => {
    const callback = spy();
    const off = onDeviceChange(callback, 480, false, false);
    expect(callback).to.have.been.calledWith(Device.Desktop);
    expect(off).to.exist;
    off();
  });

  it('should invoke callback when device width changes', async () => {
    const callback = spy();
    const off = onDeviceChange(callback, 480, true, false);
    expect(callback.args[0][0]).to.equal(Device.Desktop);
    setTimeout(() => setViewport({ width: 360, height: 640 }));
    await oneEvent(window, 'resize');
    expect(callback.args[1][0]).to.equal(Device.Mobile);
    expect(off).to.exist;
    setTimeout(() => setViewport({ width: 640, height: 640 }));
    await oneEvent(window, 'resize');
    expect(callback.args[2][0]).to.equal(Device.Desktop);
    off();
  });
});
