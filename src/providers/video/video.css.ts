import { css } from 'lit-element';

export const videoStyles = css`
  :host {
    display: block;
    contain: content;
  }

  #root {
    position: relative;
    width: 100%;
    display: block;
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
    z-index: 0;
  }

  video:not([width]) {
    width: 100%;
  }

  video:not([height]) {
    height: auto;
  }

  #root[style*='padding-bottom'] > video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`;
