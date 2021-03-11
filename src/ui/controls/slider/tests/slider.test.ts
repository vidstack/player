import {
  elementUpdated,
  expect,
  fixture,
  html,
  oneEvent,
} from '@open-wc/testing';

import { Slider } from '../Slider';
import { SliderDragEndEvent, SliderDragStartEvent } from '../slider.events';
import { SLIDER_TAG_NAME } from '../vds-slider';

describe(SLIDER_TAG_NAME, () => {
  it('should render dom correctly', async () => {
    const slider = await fixture(html`<vds-slider></vds-slider>`);
    expect(slider).dom.to.equal(`
      <vds-slider
        min="0"
        max="100"
        step="1"
        step-ratio="4"
      ></vds-slider>
    `);
  });

  it('should render shadow dom correctly', async () => {
    const slider = await fixture(html`<vds-slider></vds-slider>`);
    expect(slider).shadowDom.to.equal(`
      <div
        id="root"
        part="root"
        role="presentation"
        style="--vds-slider-fill-value:50; --vds-slider-fill-rate:0.5; --vds-slider-fill-percent:50%;"
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
          id="thumb"
          part="thumb"
          role="slider"
          style="left: 50%"
          tabindex="0"
        ></div>
        <div
          id="track"
          part="track"
        ></div>
        <div
          id="track-fill"
          part="track-fill"
        ></div>
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

  it('should bound value between min/max', async () => {
    const slider = await fixture<Slider>(html`<vds-slider></vds-slider>`);

    // Min.
    slider.value = -1000;
    await elementUpdated(slider);
    expect(slider.value).to.equal(slider.min);

    // Max.
    slider.value = 1000;
    await elementUpdated(slider);
    expect(slider.value).to.equal(slider.max);
  });

  it('should set correct fill rate', async () => {
    const slider = await fixture<Slider>(html`<vds-slider></vds-slider>`);

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

  it('should delegate focus', async () => {
    const slider = await fixture<Slider>(html`<vds-slider></vds-slider>`);
    const thumb = slider.shadowRoot?.querySelector('#thumb') as HTMLElement;

    // Focus root.
    slider.focus();
    expect(document.activeElement?.tagName).to.equal('VDS-SLIDER');
    expect(slider.matches(':focus')).to.be.true;
    expect(thumb.matches(':focus')).to.be.true;

    slider.blur();

    // Focus thumb;
    thumb.focus();
    expect(document.activeElement?.tagName).to.equal('VDS-SLIDER');
    expect(slider.matches(':focus')).to.be.true;
    expect(thumb.matches(':focus')).to.be.true;
  });

  it('should step to the left when up/left arrow key is pressed', async () => {
    const slider = await fixture<Slider>(html`<vds-slider></vds-slider>`);
    const thumb = slider.shadowRoot?.querySelector('#thumb') as HTMLElement;

    thumb.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'ArrowLeft',
      }),
    );

    thumb.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'ArrowUp',
      }),
    );

    await elementUpdated(slider);
    expect(slider.value).to.equal(48);
  });

  it('should step one to the right when down/right arrow key is pressed', async () => {
    const slider = await fixture<Slider>(html`<vds-slider></vds-slider>`);
    const thumb = slider.shadowRoot?.querySelector('#thumb') as HTMLElement;

    thumb.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'ArrowRight',
      }),
    );

    thumb.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'ArrowDown',
      }),
    );

    await elementUpdated(slider);
    expect(slider.value).to.equal(52);
  });

  it('should multiply steps when shift key is held down', async () => {
    const slider = await fixture<Slider>(html`<vds-slider></vds-slider>`);
    const thumb = slider.shadowRoot?.querySelector('#thumb') as HTMLElement;

    thumb.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'ArrowLeft',
        shiftKey: true,
      }),
    );

    await elementUpdated(slider);
    expect(slider.value).to.equal(25);

    thumb.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'ArrowRight',
        shiftKey: true,
      }),
    );

    await elementUpdated(slider);
    expect(slider.value).to.equal(50);
  });

  it('should start dragging on thumb touchstart and stop on document touchend', async () => {
    const slider = await fixture<Slider>(html`<vds-slider></vds-slider>`);
    const thumb = slider.shadowRoot?.querySelector('#thumb') as HTMLElement;

    setTimeout(() => thumb.dispatchEvent(new TouchEvent('touchstart')));
    await oneEvent(slider, SliderDragStartEvent.TYPE);
    expect(slider.isDragging).to.be.true;

    setTimeout(() => document.dispatchEvent(new TouchEvent('touchend')));
    await oneEvent(slider, SliderDragEndEvent.TYPE);
    expect(slider.isDragging).to.be.false;
  });

  it('should start dragging on thumb mousedown and stop on document mouseup', async () => {
    const slider = await fixture<Slider>(html`<vds-slider></vds-slider>`);
    const thumb = slider.shadowRoot?.querySelector('#thumb') as HTMLElement;

    setTimeout(() => thumb.dispatchEvent(new MouseEvent('mousedown')));
    await oneEvent(slider, SliderDragStartEvent.TYPE);
    expect(slider.isDragging).to.be.true;

    setTimeout(() => document.dispatchEvent(new MouseEvent('mouseup')));
    await oneEvent(slider, SliderDragEndEvent.TYPE);
    expect(slider.isDragging).to.be.false;
  });

  it('should update slider value to new thumb position when track is clicked', async () => {
    const slider = await fixture<Slider>(html`<vds-slider></vds-slider>`);
    const track = slider.shadowRoot?.querySelector('#track') as HTMLElement;
    track.dispatchEvent(
      new MouseEvent('mousedown', {
        clientX: Math.floor(track.clientWidth / 4),
      }),
    );
    expect(slider.value).to.equal(24);
  });

  it('should not change value when move events are fired on document and slider is not being dragged', async () => {
    const slider = await fixture<Slider>(html`<vds-slider></vds-slider>`);

    document.dispatchEvent(
      new MouseEvent('mousemove', {
        clientX: 25,
      }),
    );

    expect(slider.value).to.equal(50);
  });

  it('should not change value when move events are fired on document and slider is disabled', async () => {
    const slider = await fixture<Slider>(html`<vds-slider></vds-slider>`);
    const thumb = slider.shadowRoot?.querySelector('#thumb') as HTMLElement;

    thumb.dispatchEvent(new MouseEvent('mousedown'));
    expect(slider.isDragging).to.be.true;

    slider.disabled = true;

    await elementUpdated(slider);

    document.dispatchEvent(
      new MouseEvent('mousemove', {
        clientX: 25,
      }),
    );

    expect(slider.value).to.equal(50);
    expect(slider.isDragging).to.be.false;
  });

  it('should not update value when track is clicked and slider is disabled', async () => {
    const slider = await fixture<Slider>(html`<vds-slider></vds-slider>`);
    const track = slider.shadowRoot?.querySelector('#track') as HTMLElement;

    slider.disabled = true;

    track.dispatchEvent(
      new MouseEvent('mousedown', {
        clientX: Math.floor(track.clientWidth / 4),
      }),
    );

    expect(slider.value).to.equal(50);
  });

  it('should not start dragging when thumb is pressed and slider is disabled', async () => {
    const slider = await fixture<Slider>(html`<vds-slider></vds-slider>`);
    const thumb = slider.shadowRoot?.querySelector('#thumb') as HTMLElement;

    slider.disabled = true;

    thumb.dispatchEvent(new MouseEvent('mousedown'));
    thumb.dispatchEvent(new TouchEvent('touchdown'));

    expect(slider.isDragging).to.be.false;
  });
});
