import { expect, fixture } from '@open-wc/testing';
import { html, LitElement } from 'lit';
import { mock } from 'sinon';

import { forwardEvent } from '../forward-event.js';

class MyElement extends LitElement {
  get root() {
    return this.shadowRoot?.querySelector('div');
  }

  render() {
    return html`<div ${forwardEvent('play')}></div> `;
  }
}

window.customElements.define('my-element', MyElement);

describe('directives/forward-event', function () {
  /**
   * @returns {Promise<MyElement>}
   */
  async function buildFixture() {
    return await fixture('<my-element></my-element>');
  }

  it('should forward event', async function () {
    const element = await buildFixture();

    const handler = mock();
    element.addEventListener('play', handler);

    element.root?.dispatchEvent(new CustomEvent('play'));

    expect(handler).to.have.been.calledOnce;
  });

  it('should detach when element is disconnected', async function () {
    const element = await buildFixture();

    const handler = mock();
    element.addEventListener('play', handler);

    element.remove();
    element.root?.dispatchEvent(new CustomEvent('play'));

    expect(handler).to.not.have.been.called;
  });

  it('should reatach when element is reconnected', async function () {
    const element = await buildFixture();

    const handler = mock();
    element.addEventListener('play', handler);

    element.remove();
    window.document.body.appendChild(element);

    element.root?.dispatchEvent(new CustomEvent('play'));

    expect(handler).to.have.been.calledOnce;
  });
});
