import { expect, fixture, oneEvent } from '@open-wc/testing';
import { html } from 'lit';

import { DisposalBin, listen } from '../events.js';

describe('shared/events', function () {
  describe('DisposalBin', function () {
    it('should empty bin', function () {
      const disposal = new DisposalBin();

      let calls = 0;

      const cleanup = () => {
        calls += 1;
      };

      disposal.add(cleanup);
      disposal.add(cleanup);

      disposal.empty();

      expect(calls).to.equal(2);
    });
  });

  describe('listen', function () {
    it('should listen to event on target', async function () {
      /** @type {HTMLDivElement} */
      const target = await fixture(html`<div></div>`);

      // Should call handler.
      let calls = 0;

      const handler = () => {
        calls += 1;
      };

      const off = listen(target, 'click', handler);
      setTimeout(() => target.dispatchEvent(new MouseEvent('click')));
      await oneEvent(target, 'click');
      expect(calls).to.equal(1);

      // Should stop listening.
      off();
      setTimeout(() => target.dispatchEvent(new MouseEvent('click')));
      await oneEvent(target, 'click');
      expect(calls).to.equal(1);
    });
  });
});
