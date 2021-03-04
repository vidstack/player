import { elementUpdated, expect, fixture } from '@open-wc/testing';
import { html } from 'lit-html';

import { getSlottedChildren } from '../../../../utils/dom';
import { Toggle } from '../Toggle';
import { TOGGLE_TAG_NAME } from '../vds-toggle';

describe(TOGGLE_TAG_NAME, () => {
  it('it should update hidden attribute on slots when `on` state changes', async () => {
    const toggle = (await fixture(html`
      <vds-toggle>
        <div slot="on"></div>
        <div slot="off"></div>
      </vds-toggle>
    `)) as Toggle;

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
