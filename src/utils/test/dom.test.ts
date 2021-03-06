/* eslint-disable no-param-reassign */
import { expect, fixture, html } from '@open-wc/testing';
import { LitElement } from 'lit-element';

import { isColliding, safelyDefineCustomElement } from '../dom';

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
