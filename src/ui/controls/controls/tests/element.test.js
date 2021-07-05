import { elementUpdated, expect, oneEvent } from '@open-wc/testing';
import { html } from 'lit';

import { IdleChangeEvent, ViewType } from '../../../../media/index.js';
import { buildMediaFixture } from '../../../../media/test-utils/index.js';
import {
  CONTROLS_ELEMENT_TAG_NAME,
  ControlsElement
} from '../ControlsElement.js';

window.customElements.define(CONTROLS_ELEMENT_TAG_NAME, ControlsElement);

describe(CONTROLS_ELEMENT_TAG_NAME, function () {
  // eslint-disable-next-line jsdoc/require-jsdoc
  async function buildFixture() {
    const { controller, container, provider } = await buildMediaFixture(html`
      <vds-controls>
        <div class="slot"></div>
      </vds-controls>
    `);

    const controls = /** @type {ControlsElement} */ (
      container.querySelector(CONTROLS_ELEMENT_TAG_NAME)
    );

    return { controller, provider, controls };
  }

  it('should render DOM correctly', async function () {
    const { controls } = await buildFixture();
    expect(controls).dom.to.equal(`
      <vds-controls>
        <div class="slot"></div>
      </vds-controls>
    `);
  });

  it('should render shadow DOM correctly', async function () {
    const { controls } = await buildFixture();
    expect(controls).shadowDom.to.equal(`<slot></slot>`);
  });

  it('should toggle `media-can-play` attribute', async function () {
    const { provider, controls } = await buildFixture();
    provider.forceMediaReady();
    await elementUpdated(controls);
    expect(controls).to.have.attribute('media-can-play');
    provider.context.canPlay = false;
    await elementUpdated(controls);
    expect(controls).to.not.have.attribute('media-can-play');
  });

  it('should toggle `hidden` attribute', async function () {
    const { controller, controls } = await buildFixture();
    await controller.controlsManager.hide();
    expect(controls).to.have.attribute('hidden');
    await controller.controlsManager.show();
    expect(controls).to.not.have.attribute('hidden');
  });

  it('should toggle `idle` attribute', async function () {
    const { controller, controls } = await buildFixture();
    controller.idleObserver.timeout = 0;
    controller.idleObserver.start();
    await oneEvent(controller, IdleChangeEvent.TYPE);
    expect(controls).to.have.attribute('idle');
    await controller.idleObserver.stop();
    await elementUpdated(controls);
    expect(controls).to.not.have.attribute('idle');
  });

  it('should toggle `media-paused` attribute', async function () {
    const { provider, controls } = await buildFixture();
    provider.forceMediaReady();
    provider.play();
    await elementUpdated(controls);
    expect(controls).to.not.have.attribute('media-paused');
    provider.pause();
    await elementUpdated(controls);
    expect(controls).to.have.attribute('media-paused');
    provider.play();
    await elementUpdated(controls);
    expect(controls).to.not.have.attribute('media-paused');
  });

  it('should toggle `media-view-type` attribute', async function () {
    const { provider, controls } = await buildFixture();
    provider.context.viewType = ViewType.Audio;
    await elementUpdated(controls);
    expect(controls).to.have.attribute('media-view-type', ViewType.Audio);
    provider.context.viewType = ViewType.Video;
    await elementUpdated(controls);
    expect(controls).to.have.attribute('media-view-type', ViewType.Video);
    provider.context.viewType = ViewType.Unknown;
    await elementUpdated(controls);
    expect(controls).to.have.attribute('media-view-type', ViewType.Unknown);
  });
});
