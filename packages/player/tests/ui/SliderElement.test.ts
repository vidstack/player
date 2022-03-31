import '$lib/define/vds-slider';

import { elementUpdated, fixture } from '@open-wc/testing-helpers';
import { waitForEvent } from '@vidstack/foundation';
import { html } from 'lit';

import { SliderElement } from '$lib';

async function buildFixture() {
  const slider = await fixture<SliderElement>(html`<vds-slider></vds-slider>`);
  return slider;
}

it('should render light DOM', async function () {
  const slider = await buildFixture();
  expect(slider).dom.to.equal(`
    <vds-slider
      value="50"
      aria-orientation="horizontal"
      aria-valuemax="100"
      aria-valuemin="0"
      aria-valuenow="50"
      aria-valuetext="50%"
      autocomplete="off"
      role="slider"
      tabindex="0"
      style="--vds-fill-value: 50; --vds-fill-rate: 0.5; --vds-fill-percent: 50%; --vds-pointer-value: 0; --vds-pointer-rate: 0; --vds-pointer-percent: 0%;"
   ></vds-slider>
  `);
});

it('should render shadow DOM', async function () {
  const slider = await buildFixture();
  expect(slider).shadowDom.to.equal(`<slot></slot>`);
});

it('should bound value between min/max', async function () {
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

it('should set correct fill rate', async function () {
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

it('should step to the left when up/left arrow key is pressed', async function () {
  const slider = await buildFixture();

  slider.dispatchEvent(
    new KeyboardEvent('keydown', {
      key: 'ArrowLeft',
    }),
  );

  slider.dispatchEvent(
    new KeyboardEvent('keydown', {
      key: 'ArrowUp',
    }),
  );

  await elementUpdated(slider);
  expect(slider.value).to.equal(48);
});

it('should step one to the right when down/right arrow key is pressed', async function () {
  const slider = await buildFixture();

  slider.dispatchEvent(
    new KeyboardEvent('keydown', {
      key: 'ArrowRight',
    }),
  );

  slider.dispatchEvent(
    new KeyboardEvent('keydown', {
      key: 'ArrowDown',
    }),
  );

  await elementUpdated(slider);
  expect(slider.value).to.equal(52);
});

it('should multiply steps when shift key is held down', async function () {
  const slider = await buildFixture();

  slider.dispatchEvent(
    new KeyboardEvent('keydown', {
      key: 'ArrowLeft',
      shiftKey: true,
    }),
  );

  await elementUpdated(slider);
  expect(slider.value).to.equal(45);

  slider.dispatchEvent(
    new KeyboardEvent('keydown', {
      key: 'ArrowRight',
      shiftKey: true,
    }),
  );

  await elementUpdated(slider);
  expect(slider.value).to.equal(50);
});

it('should start dragging on thumb pointerdown and stop on document pointerup', async function () {
  const slider = await buildFixture();

  setTimeout(() => slider.dispatchEvent(new MouseEvent('pointerdown')));

  await waitForEvent(slider, 'vds-slider-drag-start');
  expect(slider.isDragging).to.be.true;

  setTimeout(() => document.dispatchEvent(new MouseEvent('pointerup')));

  await waitForEvent(slider, 'vds-slider-drag-end');
  expect(slider.isDragging).to.be.false;
});

it('should not change value when move events are fired on document and slider is not being dragged', async function () {
  const slider = await buildFixture();

  document.dispatchEvent(
    new MouseEvent('pointermove', {
      clientX: 25,
    }),
  );

  expect(slider.value).to.equal(50);
});

it('should not change value when move events are fired on document and slider is disabled', async function () {
  const slider = await buildFixture();

  slider.dispatchEvent(
    new MouseEvent('pointerdown', {
      clientX: 400,
    }),
  );

  expect(slider.isDragging).to.be.true;

  slider.disabled = true;
  await elementUpdated(slider);

  document.dispatchEvent(
    new MouseEvent('pointermove', {
      clientX: 25,
    }),
  );

  expect(slider.value).to.equal(50);
  expect(slider.isDragging).to.be.false;
});

it('should not start dragging when thumb is pressed and slider is disabled', async function () {
  const slider = await buildFixture();

  slider.disabled = true;
  slider.dispatchEvent(new MouseEvent('pointerdown'));

  expect(slider.isDragging).to.be.false;
});
