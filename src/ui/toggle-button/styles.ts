import { css } from 'lit';

export const toggleButtonElementStyles = css`
  :host {
    display: table;
    contain: content;
  }

  :host([hidden]) {
    display: none;
  }

  /* Only show focus styling on the host element. */
  :host(:focus) {
    outline: 1px auto Highlight;
    outline: 1px auto -webkit-focus-ring-color;
  }
  button:focus {
    outline: 0 !important;
  }

  /**
   * The following styles were extracted from the Tailwind preflight styles, to normalize
   * the button styles across browsers.
   *
   * @see https://tailwindcss.com/docs/preflight
   */

  button {
    width: 100%;
    height: 100%;
    font-family: inherit;
    font-size: 100%;
    line-height: 1.15;
    margin: 0;
    border: 0;
    background-color: transparent;
    background-image: none;
    text-transform: none;
    -webkit-appearance: button;
  }

  button::-moz-focus-inner {
    border-style: none;
    padding: 0;
  }

  button:-moz-focusring {
    outline: 1px dotted ButtonText;
  }

  button:-moz-ui-invalid {
    box-shadow: none;
  }

  button::-webkit-inner-spin-button,
  button::-webkit-outer-spin-button {
    height: auto;
  }
`;
