import { spy } from 'sinon';
import { setViewport } from '@web/test-runner-commands';
import { Device, onDeviceChange } from './DeviceObserver';
import { expect, oneEvent } from '@open-wc/testing';

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
