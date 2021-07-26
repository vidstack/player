import { css } from 'lit';

export const scrubberElementStyles = css`
  :host {
    border: 0;
    contain: content;
    display: block;
    height: 100%;
    min-width: 12.5px;
    width: 100%;
    outline: 0;
    position: relative;
    user-select: none;
    -webkit-user-select: none;
  }

  :host(:focus) {
    outline: 0;
  }

  :host([previewable]),
  :host([previewable]) vds-time-slider,
  :host([previewable]) vds-time-slider::part(slider) {
    contain: layout;
  }

  * {
    box-sizing: border-box;
    touch-action: none;
  }

  vds-seekable-progress-bar,
  ::slotted(vds-scrubber-preview) {
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    /* Needs to be above slider track but below track-fill/thumb. */
    z-index: 150;
    transform: translateY(-50%);
  }
`;
