import { css } from 'lit';

export const aspectRatioElementStyles = css`
  :host {
    display: block;
  }

  :host([hidden]) {
    display: none;
  }

  .container {
    position: relative;
    width: 100%;
    height: 0;
    padding-bottom: min(
      max(var(--vds-aspect-ratio-min-height), var(--vds-aspect-ratio-percent)),
      var(--vds-aspect-ratio-max-height)
    );
  }

  slot {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  ::slotted(*) {
    --vds-video-width: 100%;
    --vds-video-height: 100%;
    width: 100%;
    height: 100%;
  }
`;
