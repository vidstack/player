import { css } from 'lit';

export const mediaControllerStyles = css`
  :host {
    display: block;
  }

  :host([hidden]) {
    display: none;
  }
`;
