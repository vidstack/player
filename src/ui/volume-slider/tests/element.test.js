import { elementUpdated, expect, oneEvent } from '@open-wc/testing';
import { html } from 'lit';

import { VolumeChangeRequestEvent } from '../../../media/index.js';
import { buildMediaFixture } from '../../../media/test-utils/index.js';
import { SliderValueChangeEvent } from '../../slider/index.js';
import {
  VOLUME_SLIDER_ELEMENT_TAG_NAME,
  VolumeSliderElement
} from '../VolumeSliderElement.js';

window.customElements.define(
  VOLUME_SLIDER_ELEMENT_TAG_NAME,
  VolumeSliderElement
);

describe(VOLUME_SLIDER_ELEMENT_TAG_NAME, function () {
  // eslint-disable-next-line jsdoc/require-jsdoc
  async function buildFixture() {
    const { container, controller, provider } = await buildMediaFixture(html`
      <vds-volume-slider></vds-volume-slider>
    `);

    const volumeSlider = /** @type {VolumeSliderElement} */ (
      container.querySelector(VOLUME_SLIDER_ELEMENT_TAG_NAME)
    );

    return { controller, provider, volumeSlider };
  }

  it('should render DOM correctly', async function () {
    const { volumeSlider } = await buildFixture();
    expect(volumeSlider).dom.to.equal(
      `
      <vds-volume-slider
        label="Media volume slider"
        orientation="horizontal"
        step="0.5"
      ></vds-volume-slider>
      `
    );
  });

  it('should update when media volume changes', async function () {
    const { provider, volumeSlider } = await buildFixture();

    expect(volumeSlider.volume).to.equal(1);

    provider.context.volume = 0.5;
    await elementUpdated(volumeSlider);
    expect(volumeSlider.volume).to.equal(0.5);

    provider.context.volume = 0.85;
    await elementUpdated(volumeSlider);
    expect(volumeSlider.volume).to.equal(0.85);
  });

  it('should dispatch volume change request', async function () {
    const { controller, volumeSlider } = await buildFixture();

    setTimeout(() => {
      volumeSlider.dispatchEvent(
        new SliderValueChangeEvent({
          detail: 80
        })
      );
    }, 0);

    const { detail } = await oneEvent(
      controller,
      VolumeChangeRequestEvent.TYPE
    );

    expect(detail).to.equal(0.8);
  });
});
