import '../../../define/vds-slider';

import { elementUpdated, fixture } from '@open-wc/testing-helpers';
import { html } from 'lit';

import { waitForEvent } from '../../../utils/events';
import { SliderElement } from '../SliderElement';

async function buildFixture() {
  const slider = await fixture<SliderElement>(html`<vds-slider></vds-slider>`);
  return slider;
}

test('light DOM snapshot', async function () {
  const slider = await buildFixture();
  expect(slider).dom.to.equal(`
    <vds-slider
      min="0"
      max="100"
      value="50"
      aria-orientation="horizontal"
      aria-valuemax="100"
      aria-valuemin="0"
      aria-valuenow="50"
      aria-valuetext="50%"
      autocomplete="off"
      max="100"
      min="0"
      role="slider"
      tabindex="0"
   ></vds-slider>
  `);
});

test('shadow DOM snapshot', async function () {
  const slider = await buildFixture();

  // Strange fix for the style spacing differing between browsers.
  const rootStyle = slider.rootElement?.getAttribute('style');

  expect(slider).shadowDom.to.equal(`
    <div
      id="root"
      part="root"
      role="presentation"
      style="${rootStyle}"
    >
      <div
        id="thumb-container"
        part="thumb-container"
      >
        <div
          id="thumb"
          part="thumb"
        >
          <slot name="thumb"></slot>
        </div>
        <slot name="thumb-container"></slot>
      </div>
      <div
        id="track"
        part="track"
      >
        <slot name="track"></slot>
      </div>
      <div
        id="track-fill"
        part="track-fill"
      >
        <slot name="track-fill"></slot>
      </div>
      <input
        type="hidden"
        max="100"
        min="0"
        value="50"
      />
      <slot></slot>
    </div>
  `);
});

test('it should bound value between min/max', async function () {
  const slider = await buildFixture();

  // Min.
  slider.value = -1000;
  await elementUpdated(slider);
  expect(slider.value).to.equal(slider.min);

  // Max.
  slider.value = 1000;
  await elementUpdated(slider);
  expect(slider.value).to.equal(slider.max);
});

test('it should set correct fill rate', async function () {
  const slider = await buildFixture();

  slider.value = -50;
  await elementUpdated(slider);
  expect(slider.fillRate).to.equal(0);
  expect(slider.fillPercent).to.equal(0);

  slider.value = 57.5;
  await elementUpdated(slider);
  expect(slider.fillRate).to.equal(0.58);

  slider.value = 102;
  await elementUpdated(slider);
  expect(slider.fillRate).to.equal(1);
  expect(slider.fillPercent).to.equal(100);
});

test('it should step to the left when up/left arrow key is pressed', async function () {
  const slider = await buildFixture();

  slider.dispatchEvent(
    new KeyboardEvent('keydown', {
      key: 'ArrowLeft'
    })
  );

  slider.dispatchEvent(
    new KeyboardEvent('keydown', {
      key: 'ArrowUp'
    })
  );

  await elementUpdated(slider);
  expect(slider.value).to.equal(48);
});

test('it should step one to the right when down/right arrow key is pressed', async function () {
  const slider = await buildFixture();

  slider.dispatchEvent(
    new KeyboardEvent('keydown', {
      key: 'ArrowRight'
    })
  );

  slider.dispatchEvent(
    new KeyboardEvent('keydown', {
      key: 'ArrowDown'
    })
  );

  await elementUpdated(slider);
  expect(slider.value).to.equal(52);
});

test('it should multiply steps when shift key is held down', async function () {
  const slider = await buildFixture();

  slider?.dispatchEvent(
    new KeyboardEvent('keydown', {
      key: 'ArrowLeft',
      shiftKey: true
    })
  );

  await elementUpdated(slider);
  expect(slider.value).to.equal(45);

  slider?.dispatchEvent(
    new KeyboardEvent('keydown', {
      key: 'ArrowRight',
      shiftKey: true
    })
  );

  await elementUpdated(slider);
  expect(slider.value).to.equal(50);
});

test('it should start dragging on thumb pointerdown and stop on document pointerup', async function () {
  const slider = await buildFixture();
  const thumbContainer = slider.thumbContainerElement;

  setTimeout(() =>
    thumbContainer?.dispatchEvent(new MouseEvent('pointerdown'))
  );

  await waitForEvent(slider, 'vds-slider-drag-start');
  expect(slider.isDragging).to.be.true;

  setTimeout(() => document.dispatchEvent(new MouseEvent('pointerup')));

  await waitForEvent(slider, 'vds-slider-drag-end');
  expect(slider.isDragging).to.be.false;
});

test('it should not change value when move events are fired on document and slider is not being dragged', async function () {
  const slider = await buildFixture();

  document.dispatchEvent(
    new MouseEvent('pointermove', {
      clientX: 25
    })
  );

  expect(slider.value).to.equal(50);
});

test('it should not change value when move events are fired on document and slider is disabled', async function () {
  const slider = await buildFixture();
  const thumbContainer = slider.thumbContainerElement;

  thumbContainer?.dispatchEvent(
    new MouseEvent('pointerdown', {
      clientX: 400
    })
  );

  expect(slider.isDragging).to.be.true;

  slider.disabled = true;
  await elementUpdated(slider);

  document.dispatchEvent(
    new MouseEvent('pointermove', {
      clientX: 25
    })
  );

  expect(slider.value).to.equal(50);
  expect(slider.isDragging).to.be.false;
});

test('it should not update value when track is clicked and slider is disabled', async function () {
  const slider = await buildFixture();
  const track = slider.trackElement;

  slider.disabled = true;

  track?.dispatchEvent(
    new MouseEvent('pointerdown', {
      clientX: Math.floor(track.clientWidth / 4)
    })
  );

  expect(slider.value).to.equal(50);
});

test('it should not start dragging when thumb is pressed and slider is disabled', async function () {
  const slider = await buildFixture();

  slider.disabled = true;
  slider.dispatchEvent(new MouseEvent('pointerdown'));

  expect(slider.isDragging).to.be.false;
});
