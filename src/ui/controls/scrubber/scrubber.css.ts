import { css } from 'lit-element';

export const scrubberElementStyles = css`
  * {
    box-sizing: border-box;
    touch-action: none;
  }

  :host {
    display: block;
    contain: layout;
  }

  :host(:focus) {
    outline: 0;
  }

  #root {
    display: flex;
    align-items: center;
    border: 0;
    outline: 0;
    height: 100%;
    min-width: 12.5px;
    position: relative;
    user-select: none;
    -webkit-user-select: none;
  }

  #slider {
    z-index: 200;
    width: 100%;
  }

  #progress {
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    z-index: 100;
    min-height: 2.5px;
    pointer-events: none;
    height: var(--vds-scrubber-progress-height, var(--vds-slider-track-height));
    background: var(--vds-scrubber-progress-bg, #616161);
    transform-origin: left center;
    transform: translate(0%, -50%)
      scaleX(calc(var(--vds-scrubber-seekable) / var(--vds-scrubber-duration)));
    will-change: transform;
  }

  #preview-track {
    /* Needs to be above slider track but below track-fill/thumb. */
    z-index: 150;
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    min-height: 2.5px;
    opacity: 0.5;
    height: var(
      --vds-scrubber-preview-track-height,
      var(--vds-slider-track-height)
    );
    background: var(--vds-preview-track-bg, #212121);
    pointer-events: none;
    transform-origin: left center;
    transform: translateY(-50%)
      scaleX(
        calc(var(--vds-scrubber-preview-time) / var(--vds-scrubber-duration))
      );
    will-change: transform;
  }

  #preview-track[hidden],
  #preview-track[disabled] {
    display: none;
  }
`;
