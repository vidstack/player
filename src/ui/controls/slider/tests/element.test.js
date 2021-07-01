import { elementUpdated, expect, fixture, oneEvent } from '@open-wc/testing';
import { html } from 'lit';

import { IS_FIREFOX } from '../../../../utils/support.js';
import { SliderDragEndEvent, SliderDragStartEvent } from '../events.js';
import { SLIDER_ELEMENT_TAG_NAME, SliderElement } from '../SliderElement.js';

window.customElements.define(SLIDER_ELEMENT_TAG_NAME, SliderElement);

describe(SLIDER_ELEMENT_TAG_NAME, function () {
  async function buildFixture() {
    const slider = await fixture(html`<vds-slider></vds-slider>`);
    return /** @type {SliderElement} */ (slider);
  }

  it('should render DOM correctly', async function () {
    const slider = await buildFixture();
    expect(slider).dom.to.equal(`
      <vds-slider
        min="0"
        max="100"
        step="1"
        step-multiplier="10"
        value="50"
      ></vds-slider>
    `);
  });

  it('should render shadow DOM correctly', async function () {
    const slider = await buildFixture();

    // Strange fix for the style spacing differing between browsers.
    const rootStlye = slider.rootElement.getAttribute('style');

    expect(slider).shadowDom.to.equal(`
      <div
        id="root"
        part="root"
        role="presentation"
        style="${rootStlye}"
      >
        <div
          aria-disabled="false"
          aria-hidden="false"
          aria-orientation="horizontal"
          aria-valuemax="100"
          aria-valuemin="0"
          aria-valuenow="50"
          aria-valuetext="50%"
          autocomplete="off"
          id="thumb-container"
          part="thumb-container"
          role="slider"
          tabindex="0"
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
    expect(slider.fillRate).to.equal(0.575);

    slider.value = 102;
    await elementUpdated(slider);
    expect(slider.fillRate).to.equal(1);
    expect(slider.fillPercent).to.equal(100);
  });

  it('should delegate focus', async function () {
    const slider = await buildFixture();
    const thumbContainer = slider.thumbContainerElement;

    // Focus root.
    slider.focus();
    expect(document.activeElement?.tagName).to.equal('VDS-SLIDER');
    // TODO: what to do about this in FF?
    if (!IS_FIREFOX) expect(slider.matches(':focus')).to.be.true;
    expect(thumbContainer.matches(':focus')).to.be.true;

    slider.blur();

    // Focus thumb;
    thumbContainer.focus();
    expect(document.activeElement?.tagName).to.equal('VDS-SLIDER');
    if (!IS_FIREFOX) expect(slider.matches(':focus')).to.be.true;
    expect(thumbContainer.matches(':focus')).to.be.true;
  });

  it('should step to the left when up/left arrow key is pressed', async function () {
    const slider = await buildFixture();
    const thumbContainer = slider.thumbContainerElement;

    thumbContainer.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'ArrowLeft'
      })
    );

    thumbContainer.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'ArrowUp'
      })
    );

    await elementUpdated(slider);
    expect(slider.value).to.equal(48);
  });

  it('should step one to the right when down/right arrow key is pressed', async function () {
    const slider = await buildFixture();
    const thumbContainer = slider.thumbContainerElement;

    thumbContainer.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'ArrowRight'
      })
    );

    thumbContainer.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'ArrowDown'
      })
    );

    await elementUpdated(slider);
    expect(slider.value).to.equal(52);
  });

  it('should multiply steps when shift key is held down', async function () {
    const slider = await buildFixture();
    const thumbContainer = slider.thumbContainerElement;

    thumbContainer.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'ArrowLeft',
        shiftKey: true
      })
    );

    await elementUpdated(slider);
    expect(slider.value).to.equal(40);

    thumbContainer.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'ArrowRight',
        shiftKey: true
      })
    );

    await elementUpdated(slider);
    expect(slider.value).to.equal(50);
  });

  it('should start dragging on thumb pointerdown and stop on document pointerup', async function () {
    const slider = await buildFixture();
    const thumbContainer = slider.thumbContainerElement;

    setTimeout(() =>
      thumbContainer.dispatchEvent(new PointerEvent('pointerdown'))
    );
    await oneEvent(slider, SliderDragStartEvent.TYPE);
    expect(slider.isDragging).to.be.true;

    setTimeout(() => document.dispatchEvent(new PointerEvent('pointerup')));
    await oneEvent(slider, SliderDragEndEvent.TYPE);
    expect(slider.isDragging).to.be.false;
  });

  it('should update slider value to new thumb position when root is clicked', async function () {
    const slider = await buildFixture();
    const root = slider.rootElement;
    root.dispatchEvent(
      new PointerEvent('pointerdown', {
        clientX: Math.floor(root.clientWidth / 4)
      })
    );
    expect(slider.value).to.be.greaterThanOrEqual(23);
    expect(slider.value).to.be.lessThanOrEqual(24);
  });

  it('should not change value when move events are fired on document and slider is not being dragged', async function () {
    const slider = await buildFixture();

    document.dispatchEvent(
      new PointerEvent('pointermove', {
        clientX: 25
      })
    );

    expect(slider.value).to.equal(50);
  });

  it('should not change value when move events are fired on document and slider is disabled', async function () {
    const slider = await buildFixture();
    const thumbContainer = slider.thumbContainerElement;

    thumbContainer.dispatchEvent(
      new PointerEvent('pointerdown', {
        clientX: 400
      })
    );
    expect(slider.isDragging).to.be.true;

    slider.disabled = true;
    await elementUpdated(slider);

    document.dispatchEvent(
      new PointerEvent('pointermove', {
        clientX: 25
      })
    );

    expect(slider.value).to.equal(50);
    expect(slider.isDragging).to.be.false;
  });

  it('should not update value when track is clicked and slider is disabled', async function () {
    const slider = await buildFixture();
    const track = slider.trackElement;

    slider.disabled = true;

    track.dispatchEvent(
      new PointerEvent('pointerdown', {
        clientX: Math.floor(track.clientWidth / 4)
      })
    );

    expect(slider.value).to.equal(50);
  });

  it('should not start dragging when thumb is pressed and slider is disabled', async function () {
    const slider = await buildFixture();
    const thumb = slider.thumbContainerElement;

    slider.disabled = true;

    thumb.dispatchEvent(new PointerEvent('pointerdown'));

    expect(slider.isDragging).to.be.false;
  });
});
