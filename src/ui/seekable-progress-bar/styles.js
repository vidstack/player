import { css } from 'lit';

export const seekableProgressBarElementStyles = css`
  :host {
    display: flex;
    justify-content: start;
    align-items: center;
    contain: content;
  }

  #progressbar {
    display: inline-block;
    width: 100%;
    min-height: 2.5px;
    height: var(
      --vds-seekable-progress-bar-height,
      var(--vds-slider-track-height)
    );
    pointer-events: none;
    background: var(--vds-seekable-progress-bar-bg, #616161);
    transform-origin: left center;
    transform: scaleX(
      calc(var(--vds-media-seekable) / var(--vds-media-duration))
    );
    will-change: transform;
  }
`;
