import { fixture } from '@open-wc/testing-helpers';
import { html, LitElement, PropertyDeclarations } from 'lit';

import {
  getElementAttributes,
  observeAttributes,
  raf,
  safelyDefineCustomElement
} from '../dom';

describe(safelyDefineCustomElement.name, function () {
  class FakeElement extends LitElement {
    override render() {
      return html`<h1>Test Header</h1>`;
    }
  }

  test('it should not register custom element if server-side', async function () {
    safelyDefineCustomElement('fake-el', FakeElement, false);
    const el = await fixture(html`<fake-el></fake-el>`);
    expect(el.shadowRoot?.innerHTML ?? '').not.contains('<h1>Test Header</h1>');
  });

  test('it should register custom element', async function () {
    safelyDefineCustomElement('fake-el', FakeElement);
    const el = await fixture(html`<fake-el></fake-el>`);
    expect(el.shadowRoot?.innerHTML).contains('<h1>Test Header</h1>');
  });

  test('it should not register custom element if registered before', function () {
    expect(() => {
      safelyDefineCustomElement('fake-el', FakeElement);
      safelyDefineCustomElement('fake-el', FakeElement);
    }).not.throws();
  });
});

describe(getElementAttributes.name, function () {
  class ElementA extends LitElement {
    static override get properties(): PropertyDeclarations {
      return {
        propA: {},
        propB: {},
        propC: { attribute: 'prop-c' }
      };
    }
  }

  class ElementB extends ElementA {
    static override get properties(): PropertyDeclarations {
      return {
        propD: {},
        propE: { attribute: 'prop-e' }
      };
    }
  }

  it('it should return all attributes', function () {
    const attributes = getElementAttributes(ElementB);
    expect(Array.from(attributes)).eql([
      'propa',
      'propb',
      'prop-c',
      'propd',
      'prop-e'
    ]);
  });
});

describe(observeAttributes.name, function () {
  test('it should observe attributes', async function () {
    const elementA = document.createElement('div');

    const callbackSpy = vi.fn();

    const observer = observeAttributes(
      elementA,
      new Set(['a', 'b']),
      callbackSpy
    );

    elementA.setAttribute('a', '10');
    await raf();
    expect(callbackSpy).to.toHaveBeenCalledWith('a', '10');

    elementA.setAttribute('a', '20');
    await raf();
    expect(callbackSpy).to.toHaveBeenCalledWith('a', '20');

    elementA.setAttribute('b', '');
    await raf();
    expect(callbackSpy).to.toHaveBeenCalledWith('b', '');

    elementA.setAttribute('c', '');
    await raf();
    expect(callbackSpy).to.not.toHaveBeenCalledWith('c', '');

    observer.disconnect();

    elementA.setAttribute('b', '10');
    await raf();
    expect(callbackSpy).to.not.toHaveBeenCalledWith('b', '10');
  });
});
