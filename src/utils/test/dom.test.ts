/* eslint-disable no-param-reassign */
import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import { LitElement } from 'lit-element';
import { SinonStub, spy, stub } from 'sinon';
import {
  Device,
  InputDevice,
  isColliding,
  onDeviceChange,
  onInputDeviceChange,
  safelyDefineCustomElement,
} from '../dom';
import { setViewport } from '@web/test-runner-commands';

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

    const elA = el.querySelector<HTMLDivElement>('#a') as HTMLDivElement;
    const elB = el.querySelector<HTMLDivElement>('#b') as HTMLDivElement;

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

  function mockGetTime() {
    const getTimeStub = stub().returns(0);
    window.Date.prototype.getTime = getTimeStub;
    return getTimeStub;
  }

  function restoreGetTime() {
    window.Date.prototype.getTime = originalGetTime;
  }

  async function switchToTouchInputDevice() {
    setTimeout(() => window.dispatchEvent(new TouchEvent('touchstart')));
    await oneEvent(window, 'touchstart');
  }

  async function switchToMouseInputDevice(
    getTimeStub: SinonStub,
    tick: number,
  ) {
    setTimeout(() => {
      getTimeStub.returns(tick);
      window.dispatchEvent(new MouseEvent('mousemove'));
    });
    await oneEvent(window, 'mousemove');
  }

  async function switchToKeyboardInputDevice() {
    setTimeout(() => {
      window.dispatchEvent(new KeyboardEvent('keydown'));
    });
    await oneEvent(window, 'keydown');
  }

  afterEach(() => {
    restoreGetTime();
  });

  it('should invoke callback when input device changes', async () => {
    const callback = spy();
    const getTimeStub = mockGetTime();
    const off = onInputDeviceChange(callback);

    await switchToTouchInputDevice();
    expect(callback.args[0][0]).to.eq(InputDevice.Touch);

    await switchToMouseInputDevice(getTimeStub, 1000);
    expect(callback.args[1][0]).to.equal(InputDevice.Mouse);

    await switchToKeyboardInputDevice();
    expect(callback.args[2][0]).to.equal(InputDevice.Keyboard);

    off();
  });

  it('should cleanup listeners', async () => {
    const callback = spy();
    const getTimeStub = mockGetTime();
    const off = onInputDeviceChange(callback);
    off();

    await switchToTouchInputDevice();
    expect(callback).to.not.have.been.calledWith(InputDevice.Touch);

    await switchToMouseInputDevice(getTimeStub, 1000);
    expect(callback).to.not.have.been.calledWith(InputDevice.Mouse);

    await switchToKeyboardInputDevice();
    expect(callback).to.not.have.been.calledWith(InputDevice.Keyboard);
  });

  it('should filter emulated events coming from touch', async () => {
    const callback = spy();
    const getTimeStub = mockGetTime();
    const off = onInputDeviceChange(callback);

    await switchToTouchInputDevice();
    expect(callback.args[0][0]).to.equal(InputDevice.Touch);

    await switchToMouseInputDevice(getTimeStub, 300);
    expect(callback.args[1]).to.be.undefined;

    off();
  });

  it('should not attach listeners if not run on client-side', async () => {
    const callback = spy();
    const off = onInputDeviceChange(callback, false);

    setTimeout(() => window.dispatchEvent(new TouchEvent('touchstart')));
    await oneEvent(window, 'touchstart');
    expect(callback).not.to.have.been.calledWith(true);

    off();
  });
});

describe('safelyDefineCustomElement', () => {
  class FakeCustomElement extends LitElement {
    render() {
      return html`<h1>penguins</h1>`;
    }
  }

  it('should not register custom element if server-side', async () => {
    safelyDefineCustomElement('fake-el', FakeCustomElement, false);
    const el = await fixture(html`<fake-el></fake-el>`);
    expect(el.shadowRoot?.innerHTML ?? '').not.contains('<h1>penguins</h1>');
  });

  it('should register custom element', async () => {
    safelyDefineCustomElement('fake-el', FakeCustomElement);
    const el = await fixture(html`<fake-el></fake-el>`);
    expect(el.shadowRoot?.innerHTML).contains('<h1>penguins</h1>');
  });

  it('should not register custom element if registered before', () => {
    expect(() => {
      safelyDefineCustomElement('fake-el', FakeCustomElement);
      safelyDefineCustomElement('fake-el', FakeCustomElement);
    }).not.throws();
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
