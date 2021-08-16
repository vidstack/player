import { expect, fixture, oneEvent } from '@open-wc/testing';
import { html } from 'lit';
import { stub } from 'sinon';

import { DisposalBin } from '../DisposalBin';
import { isVdsEvent, listen, VdsEvent } from '../events';

describe('base/events', function () {
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
      const target = await fixture<HTMLDivElement>(html`<div></div>`);

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

  describe(VdsEvent.name, function () {
    it('should return self given no original event', async function () {
      const event = new VdsEvent('vds-event');
      expect(event.originEvent).to.equal(event);
      expect(event.isOriginTrusted).to.equal(false);
    });

    it('should return origin event', async function () {
      const originEvent = new MouseEvent('click');

      const event = new VdsEvent('vds-event', {
        originalEvent: new VdsEvent('vds-event', { originalEvent: originEvent })
      });

      expect(event.originEvent).to.equal(originEvent);
      expect(event.isOriginTrusted).to.equal(false);
    });
  });

  describe(isVdsEvent.name, function () {
    it('should return true given a VdsEvent', function () {
      expect(isVdsEvent(new VdsEvent('vds-event'))).to.be.true;
    });

    it('should return false given an event not an instance of VdsEvent', function () {
      expect(isVdsEvent(new MouseEvent('click'))).to.be.false;
    });
  });
});
