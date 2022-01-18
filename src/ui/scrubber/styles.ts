import { css } from 'lit';

export const scrubberElementStyles = css`
  :host([previewable]) {
    contain: layout;
  }

  ::slotted(vds-scrubber-preview) {
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    transform: translateY(-50%);
  }

  ::slotted(vds-scrubber-preview) {
    /* Needs to be above slider track-fill but below thumb. */
    z-index: 250;
  }
`;
