import { elementUpdated, expect } from '@open-wc/testing';
import { html } from 'lit';
import { spy } from 'sinon';

import { buildMediaFixture } from '../../../media/test-utils/index.js';
import { getSlottedChildren } from '../../../utils/dom.js';
import { BUTTON_ELEMENT_TAG_NAME, ButtonElement } from '../ButtonElement.js';

window.customElements.define(BUTTON_ELEMENT_TAG_NAME, ButtonElement);

describe(BUTTON_ELEMENT_TAG_NAME, function () {
  // eslint-disable-next-line jsdoc/require-jsdoc
  async function buildFixture() {
    const { container } = await buildMediaFixture(html`
      <vds-button>
        <div class="slot"></div>
      </vds-button>
    `);

    const button = /** @type {ButtonElement} */ (
      container.querySelector(BUTTON_ELEMENT_TAG_NAME)
    );

    return { button };
  }

  describe('render', function () {
    it.only('should render DOM correctly', async function () {
      const { button } = await buildFixture();
      expect(button).dom.to.equal(`
        <vds-button type="button">
          <div class="slot"></div>
        </vds-button>
      `);
    });

    it('should render shadow DOM correctly', async function () {
      const { button } = await buildFixture();
      expect(button).shadowDom.to.equal(`
        <button
          id="root"
          class="root"
          type="button"
          part="root"
        >
          <slot />
        </button>
      `);
    });

    it('should render <slot>', async function () {
      const { button } = await buildFixture();
      const slottedChildren = getSlottedChildren(button);
      expect(slottedChildren).to.have.length(1);
      expect(slottedChildren[0]).to.have.class('slot');
    });
  });

  describe('props/attrs', function () {
    it('should update button type as type property changes', async function () {
      const { button } = await buildFixture();
      button.type = 'submit';
      await elementUpdated(button);
      expect(button.rootElement.getAttribute('type')).to.equal('submit');
    });

    it('should set aria-label if defined', async function () {
      const { button } = await buildFixture();
      button.label = 'label';
      await elementUpdated(button);
      expect(button.rootElement.getAttribute('aria-label')).to.equal('label');
    });

    it('should not set aria-label if not defined', async function () {
      const { button } = await buildFixture();
      expect(button.rootElement.getAttribute('aria-label')).to.not.exist;
    });

    it('should set aria-controls if defined', async function () {
      const { button } = await buildFixture();
      button.controls = 'id';
      await elementUpdated(button);
      expect(button.rootElement.getAttribute('aria-controls')).to.equal('id');
    });

    it('should not set aria-controls if not defined', async function () {
      const { button } = await buildFixture();
      expect(button.rootElement.getAttribute('aria-controls')).to.not.exist;
    });

    it('should set aria-haspopup if true', async function () {
      const { button } = await buildFixture();
      button.hasPopup = true;
      await elementUpdated(button);
      expect(button.rootElement.getAttribute('aria-haspopup')).to.equal('true');
    });

    it('should not set aria-haspopup if not defined or false', async function () {
      const { button } = await buildFixture();
      expect(button.rootElement.getAttribute('aria-haspopup')).to.not.exist;
      button.hasPopup = false;
      await elementUpdated(button);
      expect(button.rootElement.getAttribute('aria-haspopup')).to.not.exist;
    });

    it('should set aria-pressed if true or false', async function () {
      const { button } = await buildFixture();
      button.pressed = true;
      await elementUpdated(button);
      expect(button.rootElement.getAttribute('aria-pressed')).to.equal('true');
      button.pressed = false;
      await elementUpdated(button);
      expect(button.rootElement.getAttribute('aria-pressed')).to.equal('false');
    });

    it('should not set aria-pressed if not defined', async function () {
      const { button } = await buildFixture();
      expect(button.rootElement.getAttribute('aria-pressed')).to.not.exist;
    });

    it('should set aria-expanded if true or false and controls is set', async function () {
      const { button } = await buildFixture();
      button.controls = 'id';
      button.expanded = true;
      await elementUpdated(button);
      expect(button.rootElement.getAttribute('aria-expanded')).to.equal('true');
      button.expanded = false;
      await elementUpdated(button);
      expect(button.rootElement.getAttribute('aria-expanded')).to.equal(
        'false'
      );
    });

    it('should not set aria-expanded if not defined', async function () {
      const { button } = await buildFixture();
      expect(button.rootElement.getAttribute('aria-expanded')).to.not.exist;
    });

    it('should not set aria-expanded if controls is not defined', async function () {
      const { button } = await buildFixture();
      button.expanded = true;
      await elementUpdated(button);
      expect(button.rootElement.getAttribute('aria-expanded')).to.not.exist;
    });

    it('should set aria-describedby if defined', async function () {
      const { button } = await buildFixture();
      button.describedBy = 'id';
      await elementUpdated(button);
      expect(button.rootElement.getAttribute('aria-describedby')).to.equal(
        'id'
      );
    });

    it('should not set aria-describedby if not defined', async function () {
      const { button } = await buildFixture();
      expect(button.rootElement.getAttribute('aria-describedby')).to.not.exist;
    });

    it('should set/reflect hidden if true', async function () {
      const { button } = await buildFixture();
      button.hidden = true;
      await elementUpdated(button);
      expect(button.rootElement.getAttribute('hidden')).to.exist;
      expect(button.getAttribute('hidden')).to.exist;
    });

    it('should not set/reflect hidden if false', async function () {
      const { button } = await buildFixture();
      button.hidden = false;
      await elementUpdated(button);
      expect(button.rootElement.getAttribute('hidden')).to.not.exist;
      expect(button.getAttribute('hidden')).to.not.exist;
    });

    it('should set/reflect disabled if true', async function () {
      const { button } = await buildFixture();
      button.disabled = true;
      await elementUpdated(button);
      expect(button.rootElement.getAttribute('disabled')).to.exist;
      expect(button.getAttribute('disabled')).to.exist;
    });

    it('should not set/reflect disabled if false', async function () {
      const { button } = await buildFixture();
      button.disabled = false;
      await elementUpdated(button);
      expect(button.rootElement.getAttribute('disabled')).to.not.exist;
      expect(button.getAttribute('disabled')).to.not.exist;
    });
  });

  describe('click/focus', function () {
    it('should forward clicks to root button', async function () {
      const { button } = await buildFixture();
      const clickSpy = spy(button.rootElement, 'click');
      button.click();
      expect(clickSpy).to.have.been.called;
    });

    it('should not forward clicks to root button if disabled', async function () {
      const { button } = await buildFixture();
      const clickSpy = spy(button.rootElement, 'click');
      button.disabled = true;
      await elementUpdated(button);
      button.click();
      expect(clickSpy).to.not.have.been.called;
    });

    it('should delegate focus', async function () {
      const { button } = await buildFixture();

      // Focus root button.
      button.rootElement.focus();
      expect(document.activeElement?.tagName).to.equal('VDS-BUTTON');

      button.rootElement.blur();

      // Focus button.
      button.focus();
      expect(button.rootElement.matches(':focus')).to.be.true;
    });

    it('should not delegate focus if disabled', async function () {
      const { button } = await buildFixture();

      button.disabled = true;
      await elementUpdated(button);

      // Focus root button.
      button.rootElement.focus();
      expect(document.activeElement?.tagName).to.not.equal('VDS-BUTTON');

      button.rootElement.blur();

      // Focus button.
      button.focus();
      expect(button.rootElement.matches(':focus')).to.be.false;
    });
  });
});
