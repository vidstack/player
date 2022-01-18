import { css } from 'lit';

export const timeSliderElementStyles = css`
  ::slotted(vds-seekable-progress-bar) {
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    transform: translateY(-50%);
  }

  ::slotted(vds-seekable-progress-bar) {
    /* Needs to be above slider track but below track-fill/thumb. */
    z-index: 150;
  }
`;
