import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import { customElement, LitElement } from 'lit-element';

import { DisposalBin, eventListener, listen } from '../events';

describe('DisposalBin', () => {
  it('should empty bin', () => {
    const disposal = new DisposalBin();

    let calls = 0;

    const cleanup = () => {
      calls += 1;
    };

    disposal.add(cleanup);
    disposal.add(cleanup);

    disposal.empty();

    expect(calls).to.equal(2);
  });
});

describe('listen', () => {
  it('should listen to event on target', async () => {
    const target = await fixture<HTMLDivElement>(html`<div></div>`);

    // Should call handler.
    let calls = 0;

    const handler = () => {
      calls += 1;
    };

    const off = listen(target, 'click', handler);
    setTimeout(() => target.dispatchEvent(new MouseEvent('click')));
    await oneEvent(target, 'click');
    expect(calls).to.equal(1);

    // Should stop listening.
    off();
    setTimeout(() => target.dispatchEvent(new MouseEvent('click')));
    await oneEvent(target, 'click');
    expect(calls).to.equal(1);
  });
});

describe('@eventListener', () => {
  @customElement('fake-element')
  class FakeElement extends LitElement {
    clickCount = 0;

    mouseDownCount = 0;

    @eventListener('click')
    handleClick(): void {
      this.clickCount += 1;
    }

    @eventListener('mousedown', { target: 'document' })
    handleMouseDown(): void {
      this.mouseDownCount += 1;
    }
  }

  it('should attach event listener to host element', async () => {
    const fakeElement = await fixture<FakeElement>(
      html`<fake-element></fake-element>`,
    );

    fakeElement.dispatchEvent(new MouseEvent('click'));

    expect(fakeElement.clickCount).to.equal(1);
    expect(fakeElement.mouseDownCount).to.equal(0);
  });

  it('should attach event listener to document', async () => {
    const fakeElement = await fixture<FakeElement>(
      html`<fake-element></fake-element>`,
    );

    fakeElement.dispatchEvent(
      new MouseEvent('mousedown', { bubbles: true, composed: true }),
    );

    expect(fakeElement.clickCount).to.equal(0);
    expect(fakeElement.mouseDownCount).to.equal(1);
  });

  it('should remove event listener when host element is disconnected from DOM', async () => {
    const fakeElement = await fixture<FakeElement>(
      html`<fake-element></fake-element>`,
    );

    fakeElement.remove();

    fakeElement.dispatchEvent(new MouseEvent('click'));
    fakeElement.dispatchEvent(
      new MouseEvent('mousedown', { bubbles: true, composed: true }),
    );

    expect(fakeElement.clickCount).to.equal(0);
    expect(fakeElement.mouseDownCount).to.equal(0);
  });
});
