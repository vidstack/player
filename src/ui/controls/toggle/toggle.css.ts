import { css } from 'lit';

export const toggleElementStyles = css`
  :host {
    display: table;
    contain: content;
  }

  :host(:focus) {
    outline: 0;
  }
`;
