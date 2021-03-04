import '../../../../core/fakes/vds-fake-media-provider';

import { elementUpdated, expect, html } from '@open-wc/testing';
import { spy } from 'sinon';

import { FakeMediaProvider } from '../../../../core';
import { buildFakeMediaProvider } from '../../../../core/fakes/helpers';
import { getSlottedChildren } from '../../../../utils/dom';
import { Control } from '../Control';
import { CONTROL_TAG_NAME } from '../vds-control';

describe(CONTROL_TAG_NAME, () => {
  async function buildFixture(): Promise<[FakeMediaProvider, Control]> {
    const provider = await buildFakeMediaProvider(html`
      <vds-control>
        <div class="slot"></div>
      </vds-control>
    `);

    const control = provider.querySelector('vds-control') as Control;

    return [provider, control];
  }

  describe('props/attrs', () => {
    it('should render <slot>', async () => {
      const [, control] = await buildFixture();
      const slottedChildren = getSlottedChildren(control);
      expect(slottedChildren).to.have.length(1);
      expect(slottedChildren[0]).to.have.class('slot');
    });

    it('should toggle root-mobile css part as context updates', async () => {
      // Nay.
      const [provider, control] = await buildFixture();
      const root = control.shadowRoot?.querySelector('.root');
      expect(root?.getAttribute('part')).to.not.include('root-mobile');

      // Yay.
      provider.deviceContext.isMobileDeviceCtx = true;
      await elementUpdated(control);
      expect(root?.getAttribute('part')).to.include('root-mobile');
    });

    it('should update button type as type property changes', async () => {
      const [, control] = await buildFixture();
      const root = control.shadowRoot?.querySelector('.root');
      control.type = 'submit';
      await elementUpdated(control);
      expect(root?.getAttribute('type')).to.equal('submit');
    });

    it('should set aria-label if defined', async () => {
      const [, control] = await buildFixture();
      const root = control.shadowRoot?.querySelector('.root');
      control.label = 'label';
      await elementUpdated(control);
      expect(root?.getAttribute('aria-label')).to.equal('label');
    });

    it('should not set aria-label if not defined', async () => {
      const [, control] = await buildFixture();
      const root = control.shadowRoot?.querySelector('.root');
      expect(root?.getAttribute('aria-label')).to.not.exist;
    });

    it('should set aria-controls if defined', async () => {
      const [, control] = await buildFixture();
      const root = control.shadowRoot?.querySelector('.root');
      control.controls = 'id';
      await elementUpdated(control);
      expect(root?.getAttribute('aria-controls')).to.equal('id');
    });

    it('should not set aria-label if not defined', async () => {
      const [, control] = await buildFixture();
      const root = control.shadowRoot?.querySelector('.root');
      expect(root?.getAttribute('aria-controls')).to.not.exist;
    });

    it('should set aria-haspopup if true', async () => {
      const [, control] = await buildFixture();
      const root = control.shadowRoot?.querySelector('.root');
      control.hasPopup = true;
      await elementUpdated(control);
      expect(root?.getAttribute('aria-haspopup')).to.equal('true');
    });

    it('should not set aria-haspopup if not defined or false', async () => {
      const [, control] = await buildFixture();
      const root = control.shadowRoot?.querySelector('.root');
      expect(root?.getAttribute('aria-haspopup')).to.not.exist;
      control.hasPopup = false;
      await elementUpdated(control);
      expect(root?.getAttribute('aria-haspopup')).to.not.exist;
    });

    it('should set aria-pressed if true or false', async () => {
      const [, control] = await buildFixture();
      const root = control.shadowRoot?.querySelector('.root');
      control.pressed = true;
      await elementUpdated(control);
      expect(root?.getAttribute('aria-pressed')).to.equal('true');
      control.pressed = false;
      await elementUpdated(control);
      expect(root?.getAttribute('aria-pressed')).to.equal('false');
    });

    it('should not set aria-pressed if not defined', async () => {
      const [, control] = await buildFixture();
      const root = control.shadowRoot?.querySelector('.root');
      expect(root?.getAttribute('aria-pressed')).to.not.exist;
    });

    it('should set aria-expanded if true or false and controls is set', async () => {
      const [, control] = await buildFixture();
      const root = control.shadowRoot?.querySelector('.root');
      control.controls = 'id';
      control.expanded = true;
      await elementUpdated(control);
      expect(root?.getAttribute('aria-expanded')).to.equal('true');
      control.expanded = false;
      await elementUpdated(control);
      expect(root?.getAttribute('aria-expanded')).to.equal('false');
    });

    it('should not set aria-expanded if not defined', async () => {
      const [, control] = await buildFixture();
      const root = control.shadowRoot?.querySelector('.root');
      expect(root?.getAttribute('aria-expanded')).to.not.exist;
    });

    it('should not set aria-expanded if controls is not defined', async () => {
      const [, control] = await buildFixture();
      const root = control.shadowRoot?.querySelector('.root');
      control.expanded = true;
      await elementUpdated(control);
      expect(root?.getAttribute('aria-expanded')).to.not.exist;
    });

    it('should set aria-describedby if defined', async () => {
      const [, control] = await buildFixture();
      const root = control.shadowRoot?.querySelector('.root');
      control.describedBy = 'id';
      await elementUpdated(control);
      expect(root?.getAttribute('aria-describedby')).to.equal('id');
    });

    it('should not set aria-label if not defined', async () => {
      const [, control] = await buildFixture();
      const root = control.shadowRoot?.querySelector('.root');
      expect(root?.getAttribute('aria-describedby')).to.not.exist;
    });

    it('should set/reflect hidden if true', async () => {
      const [, control] = await buildFixture();
      const root = control.shadowRoot?.querySelector('.root');
      control.hidden = true;
      await elementUpdated(control);
      expect(root?.getAttribute('hidden')).to.exist;
      expect(control.getAttribute('hidden')).to.exist;
    });

    it('should not set/reflect hidden if false', async () => {
      const [, control] = await buildFixture();
      const root = control.shadowRoot?.querySelector('.root');
      control.hidden = false;
      await elementUpdated(control);
      expect(root?.getAttribute('hidden')).to.not.exist;
      expect(control.getAttribute('hidden')).to.not.exist;
    });

    it('should set/reflect disabled if true', async () => {
      const [, control] = await buildFixture();
      const root = control.shadowRoot?.querySelector('.root');
      control.disabled = true;
      await elementUpdated(control);
      expect(root?.getAttribute('disabled')).to.exist;
      expect(control.getAttribute('disabled')).to.exist;
    });

    it('should not set/reflect disabled if false', async () => {
      const [, control] = await buildFixture();
      const root = control.shadowRoot?.querySelector('.root');
      control.disabled = false;
      await elementUpdated(control);
      expect(root?.getAttribute('disabled')).to.not.exist;
      expect(control.getAttribute('disabled')).to.not.exist;
    });
  });

  describe('click/focus', () => {
    it('should forward clicks to root button', async () => {
      const [, control] = await buildFixture();
      const root = control.shadowRoot?.querySelector('.root') as HTMLElement;
      const clickSpy = spy(root, 'click');
      control.click();
      expect(clickSpy).to.have.been.called;
    });

    it('should not forward clicks to root button if disabled', async () => {
      const [, control] = await buildFixture();
      const root = control.shadowRoot?.querySelector('.root') as HTMLElement;
      const clickSpy = spy(root, 'click');
      control.disabled = true;
      await elementUpdated(control);
      control.click();
      expect(clickSpy).to.not.have.been.called;
    });

    it('should delegate focus', async () => {
      const [, control] = await buildFixture();
      const root = control.shadowRoot?.querySelector('.root') as HTMLElement;

      // Focus root button.
      root.focus();
      expect(document.activeElement?.tagName).to.equal('VDS-CONTROL');

      root.blur();

      // Focus control.
      control.focus();
      expect(root.matches(':focus')).to.be.true;
    });

    it('should not delegate focus if disabled', async () => {
      const [, control] = await buildFixture();
      const root = control.shadowRoot?.querySelector('.root') as HTMLElement;
      control.disabled = true;
      await elementUpdated(control);

      // Focus root button.
      root.focus();
      expect(document.activeElement?.tagName).to.not.equal('VDS-CONTROL');

      root.blur();

      // Focus control.
      control.focus();
      expect(root.matches(':focus')).to.be.false;
    });
  });
});
