import { elementUpdated, expect } from '@open-wc/testing';
import { html } from 'lit';
import { spy } from 'sinon';

import { buildMediaFixture } from '../../../../core/fakes/fakes.helpers';
import { getSlottedChildren } from '../../../../utils/dom';
import { ButtonElement } from '../ButtonElement';
import { VDS_BUTTON_ELEMENT_TAG_NAME } from '../vds-button';

describe(VDS_BUTTON_ELEMENT_TAG_NAME, () => {
  async function buildFixture(): Promise<{
    button: ButtonElement;
  }> {
    const { container } = await buildMediaFixture(html`
      <vds-button>
        <div class="slot"></div>
      </vds-button>
    `);

    const button = container.querySelector(
      VDS_BUTTON_ELEMENT_TAG_NAME,
    ) as ButtonElement;

    return { button };
  }

  describe('render', () => {
    it('should render DOM correctly', async () => {
      const { button } = await buildFixture();
      expect(button).dom.to.equal(`
      <vds-button>
        <div class="slot"></div>
      </vds-button>
    `);
    });

    it('should render shadow DOM correctly', async () => {
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

    it('should render <slot>', async () => {
      const { button } = await buildFixture();
      const slottedChildren = getSlottedChildren(button);
      expect(slottedChildren).to.have.length(1);
      expect(slottedChildren[0]).to.have.class('slot');
    });
  });

  describe('props/attrs', () => {
    it('should update button type as type property changes', async () => {
      const { button } = await buildFixture();
      const root = button.shadowRoot?.querySelector('.root');
      button.type = 'submit';
      await elementUpdated(button);
      expect(root?.getAttribute('type')).to.equal('submit');
    });

    it('should set aria-label if defined', async () => {
      const { button } = await buildFixture();
      const root = button.shadowRoot?.querySelector('.root');
      button.label = 'label';
      await elementUpdated(button);
      expect(root?.getAttribute('aria-label')).to.equal('label');
    });

    it('should not set aria-label if not defined', async () => {
      const { button } = await buildFixture();
      const root = button.shadowRoot?.querySelector('.root');
      expect(root?.getAttribute('aria-label')).to.not.exist;
    });

    it('should set aria-controls if defined', async () => {
      const { button } = await buildFixture();
      const root = button.shadowRoot?.querySelector('.root');
      button.controls = 'id';
      await elementUpdated(button);
      expect(root?.getAttribute('aria-controls')).to.equal('id');
    });

    it('should not set aria-label if not defined', async () => {
      const { button } = await buildFixture();
      const root = button.shadowRoot?.querySelector('.root');
      expect(root?.getAttribute('aria-controls')).to.not.exist;
    });

    it('should set aria-haspopup if true', async () => {
      const { button } = await buildFixture();
      const root = button.shadowRoot?.querySelector('.root');
      button.hasPopup = true;
      await elementUpdated(button);
      expect(root?.getAttribute('aria-haspopup')).to.equal('true');
    });

    it('should not set aria-haspopup if not defined or false', async () => {
      const { button } = await buildFixture();
      const root = button.shadowRoot?.querySelector('.root');
      expect(root?.getAttribute('aria-haspopup')).to.not.exist;
      button.hasPopup = false;
      await elementUpdated(button);
      expect(root?.getAttribute('aria-haspopup')).to.not.exist;
    });

    it('should set aria-pressed if true or false', async () => {
      const { button } = await buildFixture();
      const root = button.shadowRoot?.querySelector('.root');
      button.pressed = true;
      await elementUpdated(button);
      expect(root?.getAttribute('aria-pressed')).to.equal('true');
      button.pressed = false;
      await elementUpdated(button);
      expect(root?.getAttribute('aria-pressed')).to.equal('false');
    });

    it('should not set aria-pressed if not defined', async () => {
      const { button } = await buildFixture();
      const root = button.shadowRoot?.querySelector('.root');
      expect(root?.getAttribute('aria-pressed')).to.not.exist;
    });

    it('should set aria-expanded if true or false and controls is set', async () => {
      const { button } = await buildFixture();
      const root = button.shadowRoot?.querySelector('.root');
      button.controls = 'id';
      button.expanded = true;
      await elementUpdated(button);
      expect(root?.getAttribute('aria-expanded')).to.equal('true');
      button.expanded = false;
      await elementUpdated(button);
      expect(root?.getAttribute('aria-expanded')).to.equal('false');
    });

    it('should not set aria-expanded if not defined', async () => {
      const { button } = await buildFixture();
      const root = button.shadowRoot?.querySelector('.root');
      expect(root?.getAttribute('aria-expanded')).to.not.exist;
    });

    it('should not set aria-expanded if controls is not defined', async () => {
      const { button } = await buildFixture();
      const root = button.shadowRoot?.querySelector('.root');
      button.expanded = true;
      await elementUpdated(button);
      expect(root?.getAttribute('aria-expanded')).to.not.exist;
    });

    it('should set aria-describedby if defined', async () => {
      const { button } = await buildFixture();
      const root = button.shadowRoot?.querySelector('.root');
      button.describedBy = 'id';
      await elementUpdated(button);
      expect(root?.getAttribute('aria-describedby')).to.equal('id');
    });

    it('should not set aria-label if not defined', async () => {
      const { button } = await buildFixture();
      const root = button.shadowRoot?.querySelector('.root');
      expect(root?.getAttribute('aria-describedby')).to.not.exist;
    });

    it('should set/reflect hidden if true', async () => {
      const { button } = await buildFixture();
      const root = button.shadowRoot?.querySelector('.root');
      button.hidden = true;
      await elementUpdated(button);
      expect(root?.getAttribute('hidden')).to.exist;
      expect(button.getAttribute('hidden')).to.exist;
    });

    it('should not set/reflect hidden if false', async () => {
      const { button } = await buildFixture();
      const root = button.shadowRoot?.querySelector('.root');
      button.hidden = false;
      await elementUpdated(button);
      expect(root?.getAttribute('hidden')).to.not.exist;
      expect(button.getAttribute('hidden')).to.not.exist;
    });

    it('should set/reflect disabled if true', async () => {
      const { button } = await buildFixture();
      const root = button.shadowRoot?.querySelector('.root');
      button.disabled = true;
      await elementUpdated(button);
      expect(root?.getAttribute('disabled')).to.exist;
      expect(button.getAttribute('disabled')).to.exist;
    });

    it('should not set/reflect disabled if false', async () => {
      const { button } = await buildFixture();
      const root = button.shadowRoot?.querySelector('.root');
      button.disabled = false;
      await elementUpdated(button);
      expect(root?.getAttribute('disabled')).to.not.exist;
      expect(button.getAttribute('disabled')).to.not.exist;
    });
  });

  describe('click/focus', () => {
    it('should forward clicks to root button', async () => {
      const { button } = await buildFixture();
      const root = button.shadowRoot?.querySelector('.root') as HTMLElement;
      const clickSpy = spy(root, 'click');
      button.click();
      expect(clickSpy).to.have.been.called;
    });

    it('should not forward clicks to root button if disabled', async () => {
      const { button } = await buildFixture();
      const root = button.shadowRoot?.querySelector('.root') as HTMLElement;
      const clickSpy = spy(root, 'click');
      button.disabled = true;
      await elementUpdated(button);
      button.click();
      expect(clickSpy).to.not.have.been.called;
    });

    it('should delegate focus', async () => {
      const { button } = await buildFixture();
      const root = button.shadowRoot?.querySelector('.root') as HTMLElement;

      // Focus root button.
      root.focus();
      expect(document.activeElement?.tagName).to.equal('VDS-BUTTON');

      root.blur();

      // Focus button.
      button.focus();
      expect(root.matches(':focus')).to.be.true;
    });

    it('should not delegate focus if disabled', async () => {
      const { button } = await buildFixture();
      const root = button.shadowRoot?.querySelector('.root') as HTMLElement;
      button.disabled = true;
      await elementUpdated(button);

      // Focus root button.
      root.focus();
      expect(document.activeElement?.tagName).to.not.equal('VDS-BUTTON');

      root.blur();

      // Focus button.
      button.focus();
      expect(root.matches(':focus')).to.be.false;
    });
  });
});
