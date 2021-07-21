import { elementUpdated, expect, fixture, oneEvent } from '@open-wc/testing';
import { html } from 'lit';

import { isFunction } from '../../../utils/unit.js';
import { buildMediaFixture } from '../../test-utils/index.js';
import { ViewType } from '../../ViewType.js';
import {
  MEDIA_CONTAINER_ELEMENT_TAG_NAME,
  MediaContainerConnectEvent,
  MediaContainerElement
} from '../MediaContainerElement.js';

describe(MEDIA_CONTAINER_ELEMENT_TAG_NAME, function () {
  /**
   * @param {import('lit').TemplateResult} slot
   * @returns {Promise<MediaContainerElement>}
   */
  async function buildFixture(slot = html``) {
    return fixture(html`<vds-media-container>${slot}</vds-media-container>`);
  }

  describe('render', function () {
    it('should render DOM correctly', async function () {
      const uiSlot = html`<div></div>`;
      const mediaSlot = html`
        <vds-fake-media-provider></vds-fake-media-provider>
      `;
      const container = await buildFixture(html`${mediaSlot}${uiSlot}`);
      expect(container).dom.to.equal(`
        <vds-media-container>
          <vds-fake-media-provider></vds-fake-media-provider>
          <div></div>
        </vds-media-container>
      `);
    });

    it('should render shadow DOM correctly', async function () {
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
            part="media-container"
          >
            <slot name="media"></slot>
          </div>

					<slot></slot>
        </div>
      `);
    });
  });

  describe('props', function () {
    it('should set aria busy attribute correctly', async function () {
      const { provider, container } = await buildMediaFixture();

      const root = container.rootElement;
      expect(root).to.have.attribute('aria-busy', 'true');

      provider.ctx.canPlay = true;
      await elementUpdated(container);
      expect(root).to.have.attribute('aria-busy', 'false');
    });

    it('should apply aspect ratio given it is valid', async function () {
      const { container, provider } = await buildMediaFixture();

      provider.ctx.viewType = ViewType.Video;

      container.aspectRatio = '16:9';
      await elementUpdated(container);

      const root = container.rootElement;
      expect(root).to.have.class('with-aspect-ratio');
      expect(root.style.paddingBottom).to.equal('min(100vh, 56.25%)');
    });

    it('should not apply aspect ratio given it is invalid', async function () {
      const { container, provider } = await buildMediaFixture();

      provider.ctx.viewType = ViewType.Video;

      container.aspectRatio = '16-9';
      await elementUpdated(container);

      const root = container.rootElement;
      expect(root).to.not.have.class('with-aspect-ratio');
      expect(root.style.paddingBottom).to.equal('');
    });

    it('should not apply aspect ratio given view type is not video', async function () {
      const { container, provider } = await buildMediaFixture();

      provider.ctx.viewType = ViewType.Audio;

      container.aspectRatio = '16:9';
      await elementUpdated(container);

      const root = container.rootElement;
      expect(root).to.not.have.class('with-aspect-ratio');
      expect(root.style.paddingBottom).to.equal('');
    });

    it('should not apply aspect ratio given media is fullscreen', async function () {
      const { container, provider } = await buildMediaFixture();

      provider.ctx.viewType = ViewType.Video;
      provider.ctx.fullscreen = true;

      container.aspectRatio = '16:9';
      await elementUpdated(container);

      const root = container.rootElement;
      expect(root).to.not.have.class('with-aspect-ratio');
      expect(root.style.paddingBottom).to.equal('');
    });
  });

  describe('discovery', function () {
    it('should dispatch connect event when connected to DOM', async function () {
      const container = document.createElement(
        MEDIA_CONTAINER_ELEMENT_TAG_NAME
      );

      setTimeout(() => {
        window.document.body.append(container);
      });

      const { detail } = /** @type {MediaContainerConnectEvent} */ (
        await oneEvent(document, MediaContainerConnectEvent.TYPE)
      );

      expect(detail.element).to.be.instanceOf(MediaContainerElement);
      expect(isFunction(detail.onDisconnect)).to.be.true;
    });
  });

  describe('element getters', function () {
    it('should return element [rootElement]', async function () {
      const container = await buildFixture();
      expect(container.rootElement).to.be.instanceOf(HTMLDivElement);
    });

    it('should return element [mediaContainerElement]', async function () {
      const container = await buildFixture();
      expect(container.mediaContainerElement).to.be.instanceOf(HTMLDivElement);
    });
  });

  describe('media provider', function () {
    it('should connect provider via event', async function () {
      const { container, provider } = await buildMediaFixture();
      expect(container.mediaProvider).to.equal(provider);
    });

    it('should handle media slot change', async function () {
      const { container } = await buildMediaFixture();

      const provider = document.createElement('div');
      provider.slot = 'media';

      // @ts-ignore
      provider.play = function () {};

      container.innerHTML = '';
      container.appendChild(provider);

      await elementUpdated(container);

      expect(container.mediaProvider).to.equal(provider);
    });

    // Can't seem to catch it...?
    // eslint-disable-next-line mocha/no-skipped-tests
    it.skip('should throw error if invalid element passed in to media slot', function () {
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
