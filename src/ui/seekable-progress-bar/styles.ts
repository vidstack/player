import { css } from 'lit';

export const seekableProgressBarElementStyles = css`
  :host {
    display: flex;
    justify-content: start;
    align-items: center;
    contain: content;
    height: var(
      --vds-seekable-progress-bar-height,
      var(--vds-slider-track-height)
    );
    pointer-events: none;
  }

  :host([hidden]) {
    display: none;
  }

  #progressbar {
    display: inline-block;
    width: 100%;
    height: 100%;
    min-height: 2.5px;
    transform-origin: left center;
    transform: scaleX(
      calc(var(--vds-media-seekable) / var(--vds-media-duration))
    );
    will-change: transform;
    background-color: var(--vds-seekable-progress-bar-bg, #616161);
  }
`;
