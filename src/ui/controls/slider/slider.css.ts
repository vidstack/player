import { css } from 'lit-element';

export const sliderStyles = css`
  * {
    box-sizing: border-box;
    touch-action: manipulation;
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

  #thumb {
    position: absolute;
    border: 0;
    outline: 0;
    top: 0px;
    z-index: 3;
    width: var(--vds-slider-thumb-width, 16px);
    height: var(--vds-slider-thumb-height, 16px);
    outline: none;
    border-radius: var(--vds-slider-thumb-border-radius, 50%);
    cursor: pointer;
    background: var(--vds-slider-thumb-bg, #161616);
    transform: translate(-50%, -54%);
  }

  #track {
    position: absolute;
    top: 1;
    left: 0;
    z-index: 1;
    width: 100%;
    height: var(--vds-slider-track-height);
    min-height: 2.5px;
    cursor: pointer;
    background: var(--vds-slider-track-bg, #b3b3b3);
    transform: translate(0%, -50%);
  }

  #track-fill {
    z-index: 2;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: var(--vds-slider-track-height);
    min-height: 2.5px;
    pointer-events: none;
    background: var(--vds-slider-track-fill-bg, #161616);
    transform-origin: left center;
    transform: translate(0%, -98%) scaleX(var(--vds-slider-fill-rate));
  }

  :host(:focus) #thumb,
  :host(:active) #thumb,
  #root.dragging #thumb,
  :host(:focus) #track-fill,
  :host(:active) #track-fill,
  #root.dragging #track-fill {
    border: 0;
    outline: 0;
    background-color: var(--vds-slider-active-color, #0f62fe);
  }

  :host([disabled]) #thumb,
  :host([disabled]) #track,
  :host([disabled]) #track-fill {
    background-color: var(--vds-slider-disabled-color, #e0e0e0);
  }

  input {
    display: none;
  }
`;
