import { expect, fixture } from '@open-wc/testing';
import { html, LitElement } from 'lit';
import { spy } from 'sinon';

import {
	bridgeElements,
	proxyUnknownOperations,
	raf,
	safelyDefineCustomElement,
	willElementsCollide
} from '../dom.js';

describe('utils/dom', function () {
	describe('willElementsCollide', function () {
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

	describe('safelyDefineCustomElement', function () {
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

	describe('proxyUnknownOperations', function () {
		it('should NOT forward known operations', function () {
			const objA = {
				knownOp: spy()
			};

			const objB = {
				knownOp: spy()
			};

			const destroy = proxyUnknownOperations(objA, objB);

			objA.knownOp();

			expect(objA.knownOp).to.have.been.calledOnce;
			expect(objB.knownOp).to.not.have.been.called;

			destroy();
		});

		it('should forward unknown operations', function () {
			const objA = {
				knownOp: spy()
			};

			const objB = {
				unknownOp: spy()
			};

			const destroy = proxyUnknownOperations(objA, objB);

			objA.unknownOp();

			expect(objA.knownOp).to.not.have.been.called;
			expect(objB.unknownOp).to.have.been.calledOnce;

			destroy();
		});

		it('should destroy proxy', function () {
			const objA = {
				knownOp: spy()
			};

			const objB = {
				unknownOp: spy()
			};

			const destroy = proxyUnknownOperations(objA, objB);
			destroy();

			objA.knownOp();
			expect(objA.knownOp).to.have.been.calledOnce;
			expect(objA.unknownOp).to.be.undefined;

			expect(() => {
				objA.unknownOp();
			}).to.throw;
		});
	});

	describe('bridgeElements', function () {
		class ElementA extends HTMLElement {
			knownProperty = true;

			knownMethod() {
				// ...
			}
		}

		class ElementB extends HTMLElement {
			/** @type {import('lit').PropertyDeclarations} */
			static get properties() {
				return {
					attrA: { attribute: 'attr-a' },
					attrB: { attribute: 'attr-b' },
					attrC: {}
				};
			}

			/** @type {string[]} */
			static get events() {
				return ['click', 'focus'];
			}

			unknownProperty = true;

			unknownMethod() {
				// ...
			}
		}

		beforeEach(function () {
			safelyDefineCustomElement('el-a', ElementA);
			safelyDefineCustomElement('el-b', ElementB);
		});

		it('should hydrate attributes on bridge creation', function () {
			const elementA = document.createElement('el-a');

			elementA.setAttribute('attr-a', 'a');
			elementA.setAttribute('attr-b', 'b');
			elementA.setAttribute('attrc', 'c');

			const elementB = document.createElement('el-b');

			const destroy = bridgeElements(elementA, elementB);

			expect(elementB).to.have.attribute('attr-a', 'a');
			expect(elementB).to.have.attribute('attr-b', 'b');
			expect(elementB).to.have.attribute('attrc', 'c');

			destroy();
		});

		it('should observe attribute changes and forward them', async function () {
			const elementA = document.createElement('el-a');
			const elementB = document.createElement('el-b');

			const destroy = bridgeElements(elementA, elementB);

			elementA.setAttribute('attr-a', 'a');
			elementA.setAttribute('attr-b', 'b');
			elementA.setAttribute('attrc', 'c');

			await raf();

			expect(elementB).to.have.attribute('attr-a', 'a');
			expect(elementB).to.have.attribute('attr-b', 'b');
			expect(elementB).to.have.attribute('attrc', 'c');

			destroy();

			elementA.setAttribute('attr-a', 'a1');
			elementA.setAttribute('attr-b', 'b1');
			elementA.setAttribute('attrc', 'c1');

			await raf();

			expect(elementB).to.not.have.attribute('attr-a', 'a1');
			expect(elementB).to.not.have.attribute('attr-b', 'b1');
			expect(elementB).to.not.have.attribute('attrc', 'c1');
		});

		it('should forward known events', function () {
			const elementA = document.createElement('el-a');
			const elementB = document.createElement('el-b');

			const clickSpy = spy();
			const focusSpy = spy();
			const blurSpy = spy();

			elementA.addEventListener('click', clickSpy);
			elementA.addEventListener('focus', focusSpy);
			elementA.addEventListener('blur', blurSpy);

			const destroy = bridgeElements(elementA, elementB);

			elementB.dispatchEvent(new MouseEvent('click'));
			elementB.dispatchEvent(new FocusEvent('focus'));
			elementB.dispatchEvent(new FocusEvent('blur'));

			expect(clickSpy).to.have.been.calledOnce;
			expect(focusSpy).to.have.been.calledOnce;
			expect(blurSpy).to.not.have.been.called;

			destroy();

			elementB.dispatchEvent(new MouseEvent('click'));
			elementB.dispatchEvent(new FocusEvent('focus'));
			elementB.dispatchEvent(new FocusEvent('blur'));

			expect(clickSpy).to.have.been.calledOnce;
			expect(focusSpy).to.have.been.calledOnce;
			expect(blurSpy).to.not.have.been.called;
		});

		it('should forward unknown operations', function () {
			const elementA = /** @type {ElementA & ElementB} */ (
				document.createElement('el-a')
			);

			const elementB = /** @type {ElementB} */ (document.createElement('el-b'));

			const destroy = bridgeElements(elementA, elementB);

			const knownMethodSpy = spy(elementA, 'knownMethod');
			const unknownMethodSpy = spy(elementB, 'unknownMethod');

			expect(elementA.knownProperty).to.be.true;
			expect(elementA.unknownProperty).to.be.true;

			elementA.knownProperty = false;
			expect(elementA.knownProperty).to.be.false;

			elementA.unknownProperty = false;
			expect(elementA.unknownProperty).to.be.false;
			expect(elementB.unknownProperty).to.be.false;

			elementA.knownMethod();
			expect(knownMethodSpy).to.have.been.calledOnce;

			elementA.unknownMethod();
			expect(unknownMethodSpy).to.have.been.calledOnce;

			destroy();

			expect(elementA.knownProperty).to.be.false;
			expect(elementA.unknownProperty).to.be.undefined;

			elementA.knownMethod();
			expect(knownMethodSpy).to.have.been.calledTwice;

			expect(() => {
				elementA.unknownMethod();
			}).to.throw();
		});
	});
});
