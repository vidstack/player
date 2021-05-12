import { css } from 'lit';

export const videoElementStyles = css`
  :host {
    display: block;
    contain: content;
  }

  #root {
    display: block;
    position: relative;
    width: 100%;
  }

  video {
    display: inline-block;
    border-radius: inherit;
    vertical-align: middle;
    outline: 0;
    border: 0;
    user-select: none;
    -webkit-user-select: none;
    max-height: 100vh;
  }

  video:not([width]) {
    width: 100%;
  }

  video:not([height]) {
    height: auto;
  }
`;
