import { css } from 'lit';

export const mediaContainerElementStyles = css`
  :host {
    display: block;
    contain: content;
  }

  :host([hidden]) {
    display: none;
  }

  #root {
    width: 100%;
    height: 100%;
    position: relative;
  }

  #root.with-aspect-ratio > #media-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    user-select: none;
    -webkit-user-select: none;
  }

  #media-container {
    width: 100%;
    height: auto;
    z-index: 0;
  }

  ::slotted(vds-media-ui) {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    /* Position above media container. */
    z-index: 1;
  }
`;
