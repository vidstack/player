import {
  elementUpdated,
  expect,
  fixture,
  html,
  oneEvent,
} from '@open-wc/testing';
import { mock } from 'sinon';

import { VdsCustomEvent } from '../../../../shared/events';
import { isFunction } from '../../../../utils/unit';
import { buildMediaFixture } from '../../../fakes/fakes.helpers';
import { MediaUiElement } from '../../ui';
import { ViewType } from '../../ViewType';
import {
  MediaContainerConnectEventDetail,
  VdsMediaContainerConnectEvent,
} from '../media-container.events';
import { MediaContainerElement } from '../MediaContainerElement';
import { VDS_MEDIA_CONTAINER_ELEMENT_TAG_NAME } from '../vds-media-container';

describe(VDS_MEDIA_CONTAINER_ELEMENT_TAG_NAME, () => {
  async function buildFixture(slot = html``): Promise<MediaContainerElement> {
    return fixture(html`<vds-media-container>${slot}</vds-media-container>`);
  }

  describe('render', () => {
    it('should render DOM correctly', async () => {
      const uiSlot = html`<div></div>`;
      const mediaSlot = html`
        <vds-fake-media-provider slot="media"></vds-fake-media-provider>
      `;
      const container = await buildFixture(html`${mediaSlot}${uiSlot}`);
      expect(container).dom.to.equal(`
        <vds-media-container>
          <vds-fake-media-provider slot="media"></vds-fake-media-provider>
          <div></div>
        </vds-media-container>
      `);
    });

    it('should render shadow DOM correctly', async () => {
      const container = await buildFixture();
      expect(container).shadowDom.to.equal(`
        <div
          id="root"
          part="root"
          style=""
          aria-busy="true"
        >
          <div
            id="media-container"
            part="media"
          >
            <slot name="media"></slot>
          </div>

          <vds-media-ui
            id="media-ui"
            part="ui"
            exportparts="root: ui-root, root-hidden: ui-root-hidden"
          >
            <slot></slot>
          </vds-media-ui>
        </div>
      `);
    });
  });

  describe('props', () => {
    it('should set aria busy attribute correctly', async () => {
      const { provider, container } = await buildMediaFixture();

      const root = container.shadowRoot?.querySelector(
        '#root',
      ) as HTMLDivElement;

      expect(root).to.have.attribute('aria-busy', 'true');

      provider.context.canPlay = true;
      await elementUpdated(container);
      expect(root).to.have.attribute('aria-busy', 'false');
    });

    it('should apply aspect ratio given it is valid', async () => {
      const { container, provider } = await buildMediaFixture();

      provider.context.viewType = ViewType.Video;

      container.aspectRatio = '16:9';
      await elementUpdated(container);

      const root = container.shadowRoot?.querySelector(
        '#root',
      ) as HTMLDivElement;

      expect(root).to.have.class('with-aspect-ratio');
      expect(root.style.paddingBottom).to.equal('min(100vh, 56.25%)');
    });

    it('should not apply aspect ratio given it is invalid', async () => {
      const { container, provider } = await buildMediaFixture();

      provider.context.viewType = ViewType.Video;

      container.aspectRatio = '16-9';
      await elementUpdated(container);

      const root = container.shadowRoot?.querySelector(
        '#root',
      ) as HTMLDivElement;

      expect(root).to.not.have.class('with-aspect-ratio');
      expect(root.style.paddingBottom).to.equal('');
    });

    it('should not apply aspect ratio given view type is not video', async () => {
      const { container, provider } = await buildMediaFixture();

      provider.context.viewType = ViewType.Audio;

      container.aspectRatio = '16:9';
      await elementUpdated(container);

      const root = container.shadowRoot?.querySelector(
        '#root',
      ) as HTMLDivElement;

      expect(root).to.not.have.class('with-aspect-ratio');
      expect(root.style.paddingBottom).to.equal('');
    });

    it('should not apply aspect ratio given media is fullscreen', async () => {
      const { container, provider } = await buildMediaFixture();

      provider.context.viewType = ViewType.Video;
      provider.context.fullscreen = true;

      container.aspectRatio = '16:9';
      await elementUpdated(container);

      const root = container.shadowRoot?.querySelector(
        '#root',
      ) as HTMLDivElement;

      expect(root).to.not.have.class('with-aspect-ratio');
      expect(root.style.paddingBottom).to.equal('');
    });
  });

  describe('lifecycle', () => {
    it('should dispatch connect event when connected to DOM', async () => {
      const container = document.createElement('vds-media-container');

      setTimeout(() => {
        window.document.body.append(container);
      });

      const { detail } = (await oneEvent(
        document,
        VdsMediaContainerConnectEvent.TYPE,
      )) as VdsCustomEvent<MediaContainerConnectEventDetail>;

      expect(detail.container).to.be.instanceOf(MediaContainerElement);
      expect(isFunction(detail.onDisconnect)).to.be.true;
    });

    it('should dispose of disconnect callbacks when disconnected from DOM', async () => {
      const container = document.createElement('vds-media-container');

      setTimeout(() => {
        window.document.body.append(container);
      });

      const { detail } = (await oneEvent(
        document,
        VdsMediaContainerConnectEvent.TYPE,
      )) as VdsCustomEvent<MediaContainerConnectEventDetail>;

      const callback = mock();
      detail.onDisconnect(callback);

      container.remove();
      expect(callback).to.have.been.calledOnce;
    });
  });

  describe('element getters', () => {
    it('should return element [rootElement]', async () => {
      const container = await buildFixture();
      expect(container.rootElement).to.be.instanceOf(HTMLDivElement);
    });

    it('should return element [mediaContainerElement]', async () => {
      const container = await buildFixture();
      expect(container.mediaContainerElement).to.be.instanceOf(HTMLDivElement);
    });

    it('should return element [mediaUiElement]', async () => {
      const container = await buildFixture();
      expect(container.mediaUiElement).to.be.instanceOf(MediaUiElement);
    });
  });

  describe('media provider', () => {
    it('should handle media slot change', async () => {
      const { container, provider } = await buildMediaFixture();
      expect(container.mediaProvider).to.equal(provider);
    });

    // Can't seem to catch it...?
    it.skip('should throw error if invalid element passed in to media slot', () => {
      expect(() => {
        fixture(html`
          <vds-media-container>
            <div slot="media"></div>
          </vds-media-container>
        `);
      }).to.throw();
    });
  });
});
