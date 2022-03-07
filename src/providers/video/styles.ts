import { css } from 'lit';

export const videoElementStyles = css`
  :host {
    display: inline-block;
    contain: content;
  }

  :host([hidden]) {
    display: none;
  }

  video {
    display: inline-block;
    border-radius: inherit;
    vertical-align: middle;
    outline: 0;
    border: 0;
    user-select: none;
    -webkit-user-select: none;
  }

  video:not([width]) {
    width: 100%;
  }

  video:not([height]) {
    height: 100%;
  }
`;
