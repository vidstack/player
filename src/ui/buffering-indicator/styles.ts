import { css } from 'lit';

export const bufferingIndicatorElementStyles = css`
  :host {
    display: block;
    contain: content;
  }

  :host([hidden]) {
    display: none;
  }
`;
