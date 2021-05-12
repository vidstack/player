import { expect, oneEvent } from '@open-wc/testing';
import { mock } from 'sinon';

import { VdsCustomEvent } from '../../../../shared/events';
import { isFunction } from '../../../../utils/unit';
import { buildMediaFixture } from '../../../fakes/fakes.helpers';
import {
  MediaProviderConnectEventDetail,
  VdsMediaProviderConnectEvent,
} from '../media-provider.events';
import { MediaProviderElement } from '../MediaProviderElement';

describe('MediaProviderElement', () => {
  describe('render', () => {
    it('should render DOM correctly', async () => {
      const { provider } = await buildMediaFixture();
      expect(provider).dom.to.equal(`
        <vds-fake-media-provider slot="media"></vds-fake-media-provider>
      `);
    });

    it('should render shadow DOM correctly', async () => {
      const { provider } = await buildMediaFixture();
      expect(provider).shadowDom.to.equal('');
    });
  });

  describe('lifecycle', () => {
    it('should dispatch connect event when connected to DOM', async () => {
      const provider = document.createElement('vds-fake-media-provider');

      setTimeout(() => {
        window.document.body.append(provider);
      });

      const { detail } = (await oneEvent(
        document,
        VdsMediaProviderConnectEvent.TYPE,
      )) as VdsCustomEvent<MediaProviderConnectEventDetail>;

      expect(detail.provider).to.be.instanceOf(MediaProviderElement);
      expect(isFunction(detail.onDisconnect)).to.be.true;
    });

    it('should dispose of disconnect callbacks when disconnected from DOM', async () => {
      const provider = document.createElement('vds-fake-media-provider');

      setTimeout(() => {
        window.document.body.append(provider);
      });

      const { detail } = (await oneEvent(
        document,
        VdsMediaProviderConnectEvent.TYPE,
      )) as VdsCustomEvent<MediaProviderConnectEventDetail>;

      const callback = mock();
      detail.onDisconnect(callback);

      provider.remove();
      expect(callback).to.have.been.calledOnce;
    });
  });
});
