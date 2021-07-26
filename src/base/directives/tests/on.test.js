import { elementUpdated, expect, fixture } from '@open-wc/testing';
import { html, LitElement } from 'lit';
import { mock, spy } from 'sinon';

import { on } from '../on.js';

class MyElement extends LitElement {
  /** @type {any} */
  customEvent = '';

  /** @type {boolean | AddEventListenerOptions | EventListenerOptions | undefined} */
  customOptions;

  /** @type {boolean | AddEventListenerOptions | EventListenerOptions | undefined} */
  clickOptions;

  get root() {
    return this.shadowRoot?.querySelector('div');
  }

  render() {
    return html`
      <div
        ${on('click', (e) => this.handleClick(e), this.clickOptions)}
        ${on(
          this.customEvent,
          (e) => this.handleCustomEvent(e),
          this.customOptions
        )}
      ></div>
    `;
  }

  /**
   * @param {MouseEvent} event
   */
  handleClick(event) {}

  /**
   * @param {Event} event
   */
  handleCustomEvent(event) {}
}

window.customElements.define('my-element', MyElement);

describe('directives/on', function () {
  /**
   * @returns {Promise<MyElement>}
   */
  async function buildFixture() {
    return await fixture('<my-element></my-element>');
  }

  it('should attach event listener', async function () {
    const element = await buildFixture();
    const handleClickSpy = spy(element, 'handleClick');
    const event = new MouseEvent('click');
    element.root?.dispatchEvent(event);
    expect(handleClickSpy).to.have.been.calledOnceWith(event);
  });

  it('should not reattach event listener on update', async function () {
    const element = await buildFixture();
    const handleClickSpy = spy(element, 'handleClick');

    const firstEvent = new MouseEvent('click');
    element.root?.dispatchEvent(firstEvent);

    element.requestUpdate();
    await elementUpdated(element);

    const secondEvent = new MouseEvent('click');
    element.root?.dispatchEvent(secondEvent);

    expect(handleClickSpy).to.have.been.calledTwice;
    expect(handleClickSpy.firstCall.firstArg).to.equal(firstEvent);
    expect(handleClickSpy.secondCall.firstArg).to.equal(secondEvent);
  });

  it('should reattach event listener if type changes', async function () {
    const element = await buildFixture();
    const handleBlurSpy = spy(element, 'handleCustomEvent');

    element.customEvent = 'blur';
    element.requestUpdate();
    await elementUpdated(element);

    const event = new FocusEvent('blur');
    element.root?.dispatchEvent(event);

    expect(handleBlurSpy).to.have.been.calledOnceWith(event);
  });

  it('should reattach event listener if handler changes', async function () {
    const element = await buildFixture();

    element.handleClick = mock();

    element.requestUpdate();
    await elementUpdated(element);

    const event = new MouseEvent('click');
    element.root?.dispatchEvent(event);

    expect(element.handleClick).to.have.been.calledOnceWith(event);
  });

  it('should reattach event listener if options change', async function () {
    const element = await buildFixture();
    const handleClickSpy = spy(element, 'handleClick');

    element.clickOptions = { once: true };

    element.requestUpdate();
    await elementUpdated(element);

    const firstEvent = new MouseEvent('click');
    element.root?.dispatchEvent(firstEvent);

    const secondEvent = new MouseEvent('click');
    element.root?.dispatchEvent(secondEvent);

    expect(handleClickSpy).to.have.been.calledOnceWith(firstEvent);
  });

  it('should remove event listener if disconnected from DOM', async function () {
    const element = await buildFixture();
    const handleClickSpy = spy(element, 'handleClick');

    element.remove();

    const event = new MouseEvent('click');
    element.root?.dispatchEvent(event);

    expect(handleClickSpy).to.not.have.been.calledOnceWith(event);
  });

  it('should reattach event listener if reconnected to DOM', async function () {
    const element = await buildFixture();
    const handleClickSpy = spy(element, 'handleClick');

    element.remove();
    window.document.body.appendChild(element);

    const event = new MouseEvent('click');
    element.root?.dispatchEvent(event);

    expect(handleClickSpy).to.have.been.calledOnceWith(event);
  });
});
