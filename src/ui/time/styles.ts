import { css } from 'lit';

export const timeElementStyles = css`
  :host {
    display: table;
    contain: content;
    font-variant-numeric: tabular-nums;
    user-select: none;
    -webkit-user-select: none;
  }

  :host([hidden]) {
    display: none;
  }
`;
