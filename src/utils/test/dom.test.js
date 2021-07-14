import { expect, fixture } from '@open-wc/testing';
import { html, LitElement } from 'lit';

import {
  getElementAttributes,
  observeAndForwardAttributes,
  raf,
  safelyDefineCustomElement,
  willElementsCollide
} from '../dom.js';

describe('utils/dom', function () {
  describe(willElementsCollide.name, function () {
    /**
     * @param {HTMLElement} el
     * @param {number} x
     * @param {number} y
     */
    function position(el, x, y) {
      el.style.position = 'absolute';
      el.style.width = '50px';
      el.style.height = '50px';
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
    }

    it('should collide', async function () {
      /** @type {HTMLDivElement} */
      const el = await fixture(
        html`<div>
          <div id="a"></div>
          <div id="b"></div>
        </div>`
      );

      const elA = /** @type {HTMLDivElement} */ (el.querySelector('#a'));
      const elB = /** @type {HTMLDivElement} */ (el.querySelector('#b'));

      // Same position
      position(elA, 0, 0);
      position(elB, 0, 0);
      expect(willElementsCollide(elA, elB)).to.be.true;
      // B to right of A
      position(elB, 51, 0);
      expect(willElementsCollide(elA, elB)).to.be.false;
      // B touching A on right
      position(elB, 49, 0);
      expect(willElementsCollide(elA, elB)).to.be.true;
      // B touching A on bottom
      position(elB, 0, 49);
      expect(willElementsCollide(elA, elB)).to.be.true;
      // B below A
      position(elB, 0, 51);
      expect(willElementsCollide(elA, elB)).to.be.false;
      // B above A
      position(elA, 0, -50);
      position(elB, 0, 0);
      expect(willElementsCollide(elA, elB)).to.be.false;
      // B touching A on top
      position(elA, 0, -49);
      position(elB, 0, 0);
      expect(willElementsCollide(elA, elB)).to.be.true;
    });
  });

  describe(safelyDefineCustomElement.name, function () {
    class FakeElement extends LitElement {
      render() {
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
      /** @type {import('lit').PropertyDeclarations} */
      static get properties() {
        return {
          propA: {},
          propB: {},
          propC: { attribute: 'prop-c' }
        };
      }
    }

    class B extends A {
      /** @type {import('lit').PropertyDeclarations} */
      static get properties() {
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

  describe(observeAndForwardAttributes.name, function () {
    it('should forward attributes', async function () {
      const elementA = document.createElement('div');
      const elementB = document.createElement('div');

      const observer = observeAndForwardAttributes(
        elementA,
        elementB,
        new Set(['a', 'b'])
      );

      elementA.setAttribute('a', '10');
      await raf();
      expect(elementB).to.have.attribute('a', '10');

      elementA.setAttribute('a', '20');
      await raf();
      expect(elementB).to.have.attribute('a', '20');

      elementA.setAttribute('b', '');
      await raf();
      expect(elementB).to.have.attribute('b', '');

      elementA.setAttribute('c', '');
      await raf();
      expect(elementB).to.not.have.attribute('c');

      observer.disconnect();

      elementA.setAttribute('b', '10');
      await raf();
      expect(elementB).to.have.attribute('b', '');
    });
  });
});
