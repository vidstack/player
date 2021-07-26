import { expect, oneEvent } from '@open-wc/testing';
import { isFunction } from '@utils/unit';
import { mock } from 'sinon';

import { buildMediaFixture } from '../../test-utils/index';
import {
  MediaProviderConnectEvent,
  MediaProviderElement
} from '../MediaProviderElement';

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

      const { detail } = (await oneEvent(
        document,
        'vds-media-provider-connect'
      )) as MediaProviderConnectEvent;

      expect(detail.element).to.be.instanceOf(MediaProviderElement);
      expect(isFunction(detail.onDisconnect)).to.be.true;
    });

    it('should dispose of disconnect callbacks when disconnected from DOM', async function () {
      const provider = document.createElement('vds-fake-media-provider');

      setTimeout(() => {
        window.document.body.append(provider);
      });

      const { detail } = (await oneEvent(
        document,
        'vds-media-provider-connect'
      )) as MediaProviderConnectEvent;

      const callback = mock();
      detail.onDisconnect(callback);

      provider.remove();
      expect(callback).to.have.been.calledOnce;
    });
  });
});
