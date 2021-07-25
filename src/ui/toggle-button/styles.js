import { css } from 'lit';

export const toggleButtonElementStyles = css`
  :host {
    display: table;
    contain: content;
  }

  /* Only show outline on 'vds-button' element. */
  :host(:focus) {
    outline: 0;
  }

  :host([hidden]) {
    display: none;
  }
`;
