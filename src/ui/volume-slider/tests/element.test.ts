import { elementUpdated, expect, oneEvent } from '@open-wc/testing';
import { html } from 'lit';

import { vdsEvent } from '../../../base/events';
import { buildMediaFixture } from '../../../media/test-utils';
import {
  VOLUME_SLIDER_ELEMENT_TAG_NAME,
  VolumeSliderElement
} from '../VolumeSliderElement';

window.customElements.define(
  VOLUME_SLIDER_ELEMENT_TAG_NAME,
  VolumeSliderElement
);

describe(VOLUME_SLIDER_ELEMENT_TAG_NAME, function () {
  async function buildFixture() {
    const { container, controller, provider } = await buildMediaFixture(html`
      <vds-volume-slider></vds-volume-slider>
    `);

    const volumeSlider = container.querySelector(
      VOLUME_SLIDER_ELEMENT_TAG_NAME
    ) as VolumeSliderElement;

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

    provider.ctx.volume = 0.5;
    await elementUpdated(volumeSlider);
    expect(volumeSlider.volume).to.equal(0.5);

    provider.ctx.volume = 0.85;
    await elementUpdated(volumeSlider);
    expect(volumeSlider.volume).to.equal(0.85);
  });

  it('should dispatch volume change request', async function () {
    const { controller, volumeSlider } = await buildFixture();

    setTimeout(() => {
      volumeSlider.dispatchEvent(
        vdsEvent('vds-slider-value-change', { detail: 80 })
      );
    }, 0);

    const { detail } = await oneEvent(controller, 'vds-volume-change-request');

    expect(detail).to.equal(0.8);
  });
});
