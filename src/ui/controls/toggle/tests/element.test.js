import { elementUpdated, expect, fixture } from '@open-wc/testing';
import { html } from 'lit';

import { TOGGLE_ELEMENT_TAG_NAME,ToggleElement } from '../ToggleElement.js';

window.customElements.define(TOGGLE_ELEMENT_TAG_NAME, ToggleElement);

describe(TOGGLE_ELEMENT_TAG_NAME, function () {
  async function buildFixture() {
    const toggle = await fixture(html`
      <vds-toggle>
        <div class="pressed" slot="pressed"></div>
        <div class="not-pressed"></div>
      </vds-toggle>
    `);

    return /** @type {ToggleElement}  */ (toggle);
  }

  it('should render DOM correctly', async function () {
    const toggle = await buildFixture();
    expect(toggle).dom.to.equal(`
      <vds-toggle>
        <div
          class="pressed"
          hidden=""
          slot="pressed"
        ></div>
       <div class="not-pressed"></div>
      </vds-toggle>
    `);
  });

  it('should render shadow DOM correctly', async function () {
    const toggle = await buildFixture();
    expect(toggle).shadowDom.to.equal(`
      <slot name="pressed"></slot>
      <slot></slot>
    `);
  });

  it('it should update pressed attribute on host element when `pressed` state changes', async function () {
    const toggle = await buildFixture();
    expect(toggle).to.not.have.attribute('pressed');
    toggle.pressed = true;
    await elementUpdated(toggle);
    expect(toggle).to.have.attribute('pressed');
    toggle.pressed = false;
    await elementUpdated(toggle);
    expect(toggle).to.not.have.attribute('pressed');
  });

  it('it should update hidden attribute on slots when `pressed` state changes', async function () {
    const toggle = await buildFixture();

    const pressedSlot = toggle.pressedSlotElement;
    const notPressedSlot = toggle.notPressedSlotElement;

    // Not Pressed.
    expect(pressedSlot?.getAttribute('hidden')).to.equal('');
    expect(notPressedSlot?.getAttribute('hidden')).to.not.exist;

    toggle.pressed = true;
    await elementUpdated(toggle);

    // Pressed.
    expect(pressedSlot?.getAttribute('hidden')).to.not.exist;
    expect(notPressedSlot?.getAttribute('hidden')).to.equal('');
  });
});
