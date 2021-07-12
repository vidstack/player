import { css } from 'lit';

export const scrubberPreviewElementStyles = css`
  :host {
    contain: layout;
    display: block;
  }

  #track {
    width: 100%;
    height: var(
      --vds-scrubber-preview-track-height,
      var(--vds-slider-track-height)
    );
    min-height: 2.5px;
    pointer-events: none;
  }

  #track[hidden] {
    display: none;
  }

  #track-fill {
    background: var(--vds-scrubber-preview-track-fill-bg, #21212150);
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    transform-origin: left center;
    transform: scaleX(
      calc(var(--vds-scrubber-preview-time) / var(--vds-media-duration))
    );
    will-change: transform;
  }

  #track-fill[hidden] {
    display: none;
  }
`;
