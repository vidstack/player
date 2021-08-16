import { expect, fixture } from '@open-wc/testing';
import { html, LitElement, PropertyDeclarations } from 'lit';
import { spy } from 'sinon';

import {
  getElementAttributes,
  observeAttributes,
  raf,
  safelyDefineCustomElement
} from '../dom';

describe('utils/dom', function () {
  describe(safelyDefineCustomElement.name, function () {
    class FakeElement extends LitElement {
      override render() {
        return html`<h1>penguins</h1>`;
      }
    }

    it('should not register custom element if server-side', async function () {
      safelyDefineCustomElement('fake-el', FakeElement, false);
      const el = await fixture(html`<fake-el></fake-el>`);
      expect(el.shadowRoot?.innerHTML ?? '').not.contains('<h1>penguins</h1>');
    });

    it('should register custom element', async function () {
      safelyDefineCustomElement('fake-el', FakeElement);
      const el = await fixture(html`<fake-el></fake-el>`);
      expect(el.shadowRoot?.innerHTML).contains('<h1>penguins</h1>');
    });

    it('should not register custom element if registered before', function () {
      expect(() => {
        safelyDefineCustomElement('fake-el', FakeElement);
        safelyDefineCustomElement('fake-el', FakeElement);
      }).not.throws();
    });
  });

  describe(getElementAttributes.name, function () {
    class A extends LitElement {
      static get properties(): PropertyDeclarations {
        return {
          propA: {},
          propB: {},
          propC: { attribute: 'prop-c' }
        };
      }
    }

    class B extends A {
      static get properties(): PropertyDeclarations {
        return {
          propD: {},
          propE: { attribute: 'prop-e' }
        };
      }
    }

    it('it should return all attributes', function () {
      const attributes = getElementAttributes(B);
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
    it('should observe attributes', async function () {
      const elementA = document.createElement('div');

      const callbackSpy = spy();

      const observer = observeAttributes(
        elementA,
        new Set(['a', 'b']),
        callbackSpy
      );

      elementA.setAttribute('a', '10');
      await raf();
      expect(callbackSpy).to.have.been.calledWith('a', '10');

      elementA.setAttribute('a', '20');
      await raf();
      expect(callbackSpy).to.have.been.calledWith('a', '20');

      elementA.setAttribute('b', '');
      await raf();
      expect(callbackSpy).to.have.been.calledWith('b', '');

      elementA.setAttribute('c', '');
      await raf();
      expect(callbackSpy).to.not.have.been.calledWith('c', '');

      observer.disconnect();

      elementA.setAttribute('b', '10');
      await raf();
      expect(callbackSpy).to.not.have.been.calledWith('b', '10');
    });
  });
});
