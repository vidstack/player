import { elementUpdated, expect, fixture } from '@open-wc/testing';
import { html } from 'lit-html';

import { getSlottedChildren } from '../../../../utils/dom';
import { Toggle } from '../Toggle';
import { TOGGLE_TAG_NAME } from '../vds-toggle';

describe(TOGGLE_TAG_NAME, () => {
  async function buildFixture(): Promise<Toggle> {
    return fixture<Toggle>(html`
      <vds-toggle>
        <div class="on" slot="on"></div>
        <div class="off" slot="off"></div>
      </vds-toggle>
    `);
  }

  it('should render dom correctly', async () => {
    const toggle = await buildFixture();
    expect(toggle).dom.to.equal(`
      <vds-toggle>
        <div
          class="on"
          hidden=""
          slot="on"
        ></div>
       <div
         class="off"
         slot="off"
       ></div>
      </vds-toggle>
    `);
  });

  it('should render shadow dom correctly', async () => {
    const toggle = await buildFixture();
    expect(toggle).shadowDom.to.equal(`
      <slot name="on"></slot>
      <slot name="off"></slot> 
    `);
  });

  it('it should update hidden attribute on slots when `on` state changes', async () => {
    const toggle = await buildFixture();

    // On.
    expect(getSlottedChildren(toggle, 'on')[0].getAttribute('hidden')).to.equal(
      '',
    );
    expect(getSlottedChildren(toggle, 'off')[0].getAttribute('hidden')).to.not
      .exist;

    toggle.on = true;
    await elementUpdated(toggle);

    // Off.
    expect(getSlottedChildren(toggle, 'on')[0].getAttribute('hidden')).to.not
      .exist;
    expect(
      getSlottedChildren(toggle, 'off')[0].getAttribute('hidden'),
    ).to.equal('');
  });
});
