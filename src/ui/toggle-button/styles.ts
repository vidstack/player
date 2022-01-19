import { css } from 'lit';

export const toggleButtonElementStyles = css`
  :host {
    display: table;
    contain: content;
    user-select: none;
    -webkit-user-select: none;
  }

  :host([hidden]) {
    display: none;
  }

  :host(:focus) {
    outline: none;
  }
  :host(:focus-visible) {
    outline: 1px auto Highlight;
    outline: 1px auto -webkit-focus-ring-color;
  }
  :host(.focus-visible) {
    outline: 1px auto Highlight;
    outline: 1px auto -webkit-focus-ring-color;
  }
`;
