import { expect, oneEvent } from '@open-wc/testing';
import { mock } from 'sinon';

import { isFunction } from '../../../utils/unit.js';
import { buildMediaFixture } from '../../test-utils/index.js';
import { MediaProviderElement } from '../MediaProviderElement.js';

describe('MediaProviderElement', function () {
  describe('render', function () {
    it('should render DOM correctly', async function () {
      const { provider } = await buildMediaFixture();
      expect(provider).dom.to.equal(`
        <vds-fake-media-provider></vds-fake-media-provider>
      `);
    });

    it('should render shadow DOM correctly', async function () {
      const { provider } = await buildMediaFixture();
      expect(provider).shadowDom.to.equal('');
    });
  });

  describe('lifecycle', function () {
    it('should dispatch connect event when connected to DOM', async function () {
      const provider = document.createElement('vds-fake-media-provider');

      setTimeout(() => {
        window.document.body.append(provider);
      });

      const { detail } =
        /** @type {import('../MediaProviderElement').MediaProviderConnectEvent} */ (
          await oneEvent(document, 'vds-media-provider-connect')
        );

      expect(detail.element).to.be.instanceOf(MediaProviderElement);
      expect(isFunction(detail.onDisconnect)).to.be.true;
    });

    it('should dispose of disconnect callbacks when disconnected from DOM', async function () {
      const provider = document.createElement('vds-fake-media-provider');

      setTimeout(() => {
        window.document.body.append(provider);
      });

      const { detail } =
        /** @type {import('../MediaProviderElement').MediaProviderConnectEvent} */ (
          await oneEvent(document, 'vds-media-provider-connect')
        );

      const callback = mock();
      detail.onDisconnect(callback);

      provider.remove();
      expect(callback).to.have.been.calledOnce;
    });
  });
});
