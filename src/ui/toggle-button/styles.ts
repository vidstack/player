import { css } from 'lit';

export const toggleButtonElementStyles = css`
  :host {
    display: table;
    contain: content;
    user-select: none;
  }

  :host([hidden]) {
    display: none;
  }
`;
