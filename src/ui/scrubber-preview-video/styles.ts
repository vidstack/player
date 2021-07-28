import { css } from 'lit';

export const scrubberPreviewVideoElementStyles = css`
  :host {
    display: block;
    contain: content;
  }

  :host([hidden]) {
    display: none;
  }

  video {
    display: block;
  }
`;
