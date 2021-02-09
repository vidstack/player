/* eslint-disable no-param-reassign */
import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import { spy, stub } from 'sinon';
import { isColliding, onInputDeviceChange } from '../dom';

describe('isColliding', () => {
  function position(el: HTMLElement, x: number, y: number) {
    el.style.position = 'absolute';
    el.style.width = '50px';
    el.style.height = '50px';
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
  }

  it('should collide', async () => {
    const el = await fixture(
      html`<div>
        <div id="a"></div>
        <div id="b"></div>
      </div>`,
    );

    const elA = el.querySelector<HTMLDivElement>('#a')!;
    const elB = el.querySelector<HTMLDivElement>('#b')!;

    // Same position
    position(elA, 0, 0);
    position(elB, 0, 0);
    expect(isColliding(elA, elB)).to.be.true;
    // B to right of A
    position(elB, 51, 0);
    expect(isColliding(elA, elB)).to.be.false;
    // B touching A on right
    position(elB, 49, 0);
    expect(isColliding(elA, elB)).to.be.true;
    // B touching A on bottom
    position(elB, 0, 49);
    expect(isColliding(elA, elB)).to.be.true;
    // B below A
    position(elB, 0, 51);
    expect(isColliding(elA, elB)).to.be.false;
    // B above A
    position(elA, 0, -50);
    position(elB, 0, 0);
    expect(isColliding(elA, elB)).to.be.false;
    // B touching A on top
    position(elA, 0, -49);
    position(elB, 0, 0);
    expect(isColliding(elA, elB)).to.be.true;
  });
});

describe('onInputDeviceChange', () => {
  const originalGetTime = window.Date.prototype.getTime;

  const mockGetTime = () => {
    const getTimeStub = stub().returns(0);
    window.Date.prototype.getTime = getTimeStub;
    return getTimeStub;
  };

  const restoreGetTime = () => {
    window.Date.prototype.getTime = originalGetTime;
  };

  it('should invoke callback when input device changes', async () => {
    const callback = spy();
    const getTimeStub = mockGetTime();
    onInputDeviceChange(callback);

    setTimeout(() => window.dispatchEvent(new TouchEvent('touchstart')));
    await oneEvent(window, 'touchstart');
    expect(callback).to.have.been.calledWith(true);

    setTimeout(() => {
      getTimeStub.returns(1000);
      window.dispatchEvent(new MouseEvent('mousemove'));
    });
    await oneEvent(window, 'mousemove');
    expect(callback).to.have.been.calledWith(false);

    restoreGetTime();
  });

  it('should cleanup listeners', async () => {
    const callback = spy();
    const getTimeStub = mockGetTime();
    const off = onInputDeviceChange(callback);
    off();

    setTimeout(() => window.dispatchEvent(new TouchEvent('touchstart')));
    await oneEvent(window, 'touchstart');
    expect(callback).to.not.have.been.calledWith(true);

    setTimeout(() => {
      getTimeStub.returns(1000);
      window.dispatchEvent(new MouseEvent('mousemove'));
    });
    await oneEvent(window, 'mousemove');
    expect(callback).to.not.have.been.calledWith(false);

    restoreGetTime();
  });

  it('should filter emulated events coming from touch', async () => {
    const callback = spy();
    const getTimeStub = mockGetTime();
    onInputDeviceChange(callback);

    setTimeout(() => window.dispatchEvent(new TouchEvent('touchstart')));
    await oneEvent(window, 'touchstart');
    expect(callback).to.have.been.calledWith(true);

    setTimeout(() => {
      getTimeStub.returns(300);
      window.dispatchEvent(new MouseEvent('mousemove'));
    });
    await oneEvent(window, 'mousemove');
    expect(callback).to.not.have.been.calledWith(false);

    restoreGetTime();
  });

  it('should not attach listeners if not run on client-side', async () => {
    const callback = spy();
    const off = onInputDeviceChange(callback, false);

    setTimeout(() => window.dispatchEvent(new TouchEvent('touchstart')));
    await oneEvent(window, 'touchstart');
    expect(callback).not.to.have.been.calledWith(true);

    // No-op: call to include coverage report.
    off();
  });
});
