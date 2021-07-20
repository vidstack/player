import { css } from 'lit';
export const toggleButtonElementStyles = css`
  /* Only show outline on 'vds-button' element. */
  :host(:focus) {
    outline: 0;
  }
`;
