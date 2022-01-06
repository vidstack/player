import { elementUpdated, expect, oneEvent } from '@open-wc/testing';
import { html } from 'lit';

import { vdsEvent } from '../../../base/events';
import { buildMediaPlayerFixture } from '../../../media/test-utils';
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
    const { player } = await buildMediaPlayerFixture(html`
      <vds-volume-slider></vds-volume-slider>
    `);

    const volumeSlider = player.querySelector(VOLUME_SLIDER_ELEMENT_TAG_NAME)!;

    return { player, volumeSlider };
  }

  test('it should render DOM correctly', async function () {
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

  test('it should update when media volume changes', async function () {
    const { player, volumeSlider } = await buildFixture();

    expect(volumeSlider.volume).to.equal(1);

    player._mediaStore.volume.set(0.25);
    await elementUpdated(volumeSlider);
    expect(volumeSlider.volume).to.equal(0.25);

    player._mediaStore.volume.set(0.85);
    await elementUpdated(volumeSlider);
    expect(volumeSlider.volume).to.equal(0.85);
  });

  test('it should dispatch volume change request', async function () {
    const { player, volumeSlider } = await buildFixture();

    setTimeout(() => {
      volumeSlider.dispatchEvent(
        vdsEvent('vds-slider-value-change', { detail: 80 })
      );
    }, 0);

    const { detail } = await oneEvent(player, 'vds-volume-change-request');

    expect(detail).to.equal(0.8);
  });
});
