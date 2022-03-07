import { css } from 'lit';

export const aspectRatioElementStyles = css`
  :host {
    /**
     * Default aspect ratio is calculated using browser default media width and height.
     */
    --vds-default-aspect-ratio: calc(150 / 300);

    --vds-configured-aspect-ratio: var(
      --vds-aspect-ratio,
      var(--vds-default-aspect-ratio)
    );

    --vds-computed-aspect-ratio: calc(
      100% * var(--vds-configured-aspect-ratio)
    );

    /**
     * Default minimum height is calculated using browser default media height.
     */
    --vds-default-min-height: 150px;

    --vds-configured-min-height: var(
      --vds-min-height,
      var(--vds-default-min-height)
    );

    /**
     * Default maximum height is calculated using the current viewport height.
     */
    --vds-default-max-height: 100vh;

    --vds-configured-max-height: var(
      --vds-max-height,
      var(--vds-default-max-height)
    );

    /**
     * Padding is calculated by clamping the desired aspect ratio between the configured minimum
     * and maximum heights.
     */
    --vds-aspect-ratio-padding: min(
      max(var(--vds-configured-min-height), var(--vds-computed-aspect-ratio)),
      var(--vds-configured-max-height)
    );

    display: block;
    position: relative;
    width: 100%;
    height: 0;
    padding-bottom: var(--vds-aspect-ratio-padding);
  }

  :host([hidden]) {
    display: none;
  }

  slot {
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
  }

  ::slotted(*) {
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    height: 100% !important;
  }
`;
