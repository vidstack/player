import { css } from 'lit';

export const aspectRatioElementStyles = css`
  :host {
    display: block;
    height: 0;
    padding-bottom: min(
      max(var(--vds-min-height), var(--vds-aspect-ratio-percent)),
      var(--vds-max-height)
    );
    position: relative;
    width: 100%;
  }

  :host([hidden]) {
    display: none;
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
    width: 100%;
    height: 100%;
  }
`;
