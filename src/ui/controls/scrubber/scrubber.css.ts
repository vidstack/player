import { css } from 'lit-element';

export const scrubberStyles = css`
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
  }

  #slider {
    z-index: 20;
    width: 100%;
  }

  #progress {
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    z-index: 10;
    min-height: 2.5px;
    pointer-events: none;
    height: var(--vds-scrubber-progress-height, var(--vds-slider-track-height));
    background: var(--vds-scrubber-progress-bg, #616161);
    transform-origin: left center;
    transform: translate(0%, -50%)
      scaleX(calc(var(--vds-scrubber-seekable) / var(--vds-scrubber-duration)));
  }
`;
