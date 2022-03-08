<script>
  import { eventCallback, EventsAddon } from '@vitebook/client/addons';
  import { safelyDefineCustomElement } from '../../utils/dom';
  import { SliderElement } from './SliderElement';
  import { SliderVideoElement } from './SliderVideoElement';

  safelyDefineCustomElement('vds-slider', SliderElement);
  safelyDefineCustomElement('vds-slider-video', SliderVideoElement);
</script>

<vds-slider on:canplay={eventCallback} on:error={eventCallback}>
  <div class="track" />
  <div class="track fill" />
  <div class="thumb-container">
    <div class="thumb" />
  </div>
  <vds-slider-video src="https://media-files.vidstack.io/240p.mp4" />
</vds-slider>

<EventsAddon />

<style>
  vds-slider {
    --slider-height: 48px;
    --slider-thumb-width: 24px;
    --slider-track-height: 4px;

    display: flex;
    align-items: center;
    position: relative;
    cursor: pointer;
    height: var(--slider-height);
    width: 100%;
    /** Prevent thumb flowing out of slider. */
    margin: 0 calc(var(--slider-thumb-width) / 2);
    max-width: 85%;
  }

  .track {
    background-color: #6366f1;
    width: 100%;
    height: var(--slider-track-height);
    position: absolute;
    top: 50%;
    left: 0;
    z-index: 0;
    transform: translateY(-50%);
  }

  .track.fill {
    background-color: #a5b4fc;
    transform-origin: left center;
    transform: translateY(-50%) scaleX(var(--vds-slider-fill-rate));
    will-change: transform;
    z-index: 1; /** above track. */
  }

  .thumb-container {
    position: absolute;
    top: 0;
    left: var(--vds-slider-fill-percent);
    width: var(--slider-thumb-width);
    height: 100%;
    transform: translateX(-50%); /** re-center along x-axis. */
    z-index: 2; /** above track fill. */
    will-change: left;
  }

  :global([dragging] .thumb-container) {
    left: var(--vds-slider-pointer-percent);
  }

  .thumb {
    position: absolute;
    top: 50%;
    left: 0;
    width: var(--slider-thumb-width);
    height: var(--slider-thumb-width);
    border-radius: 9999px;
    background-color: #fff;
    transform: translateY(-50%);
  }

  vds-slider-video {
    --width: 156px;
    --width-half: calc(var(--width) / 2);
    --top: calc(-1 * var(--width-half) - 24px);
    --left-clamp: max(var(--width-half), var(--vds-slider-pointer-percent));
    --right-clamp: calc(100% - var(--width-half));
    --left: min(var(--left-clamp), var(--right-clamp));

    position: absolute;
    top: var(--top);
    left: var(--left);
    width: var(--width);
    opacity: 0;
    transition: opacity ease-out 200ms;
    /* re-position to center. */
    transform: translateX(-50%);
    will-change: left;
    border-radius: 2px;
    background-color: #000;
  }

  /* show video while device pointer is inside slider. */
  :global([pointing] vds-slider-video) {
    opacity: 1;
    transition: opacity ease-in 200ms;
  }

  /* Temporarily hide while video is loading. */
  vds-slider-video:not([video-can-play]) {
    opacity: 0 !important;
  }

  /* Hide if video fails to load. */
  :global(vds-slider-video[video-error]) {
    display: none;
  }
</style>
