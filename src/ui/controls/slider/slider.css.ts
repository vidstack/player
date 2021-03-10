import { css } from 'lit-element';

export const sliderStyles = css`
  * {
    box-sizing: border-box;
  }

  :host {
    display: block;
    contain: layout;
    min-height: 2.5px;
  }

  :host(:focus),
  :host(:active) {
    outline: 0;
  }

  #root {
    display: flex;
    align-items: center;
    border: 0;
    outline: 0;
    height: 100%;
    position: relative;
    min-width: 12.5px;
    user-select: none;
  }

  #root.vertical-orientation {
    transform: rotate(270deg);
  }

  #thumb {
    position: absolute;
    border: 0;
    outline: 0;
    top: 0px;
    z-index: 3;
    width: 16px;
    height: 16px;
    outline: none;
    border-radius: 50%;
    cursor: pointer;
    background: var(--cds-ui-05, #161616);
    transform: translate(-50%, -54%);
  }

  :host(:focus) #thumb,
  :host(:active) #thumb {
    border: 0;
    outline: 0;
    background-color: var(--cds-interactive-04, #0f62fe);
  }

  #track {
    position: absolute;
    top: 1;
    left: 0;
    z-index: 0;
    width: 100%;
    min-height: 2.5px;
    cursor: pointer;
    background: var(--cds-ui-03, #e0e0e0);
    transform: translate(0%, -50%);
  }

  #track-fill {
    z-index: 2;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    min-height: 2.5px;
    pointer-events: none;
    background: var(--cds-ui-05, #161616);
    transform-origin: left center;
    transform: translate(0%, -98%) scaleX(var(--vds-slider-fill-rate));
  }

  :host(:focus) #track-fill,
  :host(:focus) #track-fill {
    background-color: var(--cds-interactive-04, #0f62fe);
  }

  input {
    display: none;
  }
`;
