import {
  EnterFullscreenRequestEvent,
  ExitFullscreenRequestEvent,
  mediaContext,
  MediaRemoteControl
} from '../../../media/index.js';
import {
  storybookAction,
  StorybookControlType
} from '../../../shared/storybook/index.js';
import {
  TOGGLE_BUTTON_ELEMENT_STORYBOOK_ARG_TYPES,
  ToggleButtonElement
} from '../toggle-button/index.js';

export const FULLSCREEN_BUTTON_ELEMENT_TAG_NAME = 'vds-fullscreen-button';

/** @typedef {import('./types').FullscreenButton} FullscreenButton */

/**
 * A button for toggling the fullscreen mode of the player.
 *
 * @implements {FullscreenButton}
 *
 * @tagname vds-fullscreen-button
 *
 * @slot enter - The content to show when the `fullscreen` state is `false`.
 * @slot exit - The content to show when the `fullscreen` state is `true`.
 *
 * @csspart button - The root button (`<vds-button>`).
 * @csspart button-* - All `vds-button` parts re-exported with the `button` prefix such as `button-root`.
 *
 * @example
 * ```html
 * <vds-fullscreen-button>
 *   <!-- Showing -->
 *   <div slot="enter"></div>
 *   <!-- Hidden - `hidden` attribute will automatically be applied/removed -->
 *   <div slot="exit" hidden></div>
 * </vds-fullscreen-button>
 * ```
 */
export class FullscreenButtonElement extends ToggleButtonElement {
  /**
   * @protected
   * @readonly
   */
  remoteControl = new MediaRemoteControl(this);

  constructor() {
    super();

    // Properties
    this.label = 'Fullscreen';
    /** @internal @readonly @type {boolean} */
    this.pressed = mediaContext.fullscreen.initialValue;
  }

  /** @type {import('../../../shared/context').ContextConsumerDeclarations} */
  static get contextConsumers() {
    return {
      pressed: mediaContext.fullscreen
    };
  }

  get enterSlotElement() {
    return this.currentNotPressedSlotElement;
  }

  get exitSlotElement() {
    return this.currentPressedSlotElement;
  }

  /** @protected */
  getPressedSlotName() {
    return 'exit';
  }

  /** @protected */
  getNotPressedSlotName() {
    return 'enter';
  }

  /**
   * @protected
   * @param {Event} event
   * @returns {void}
   */
  handleButtonClick(event) {
    if (this.pressed) {
      this.remoteControl.exitFullscreen(event);
    } else {
      this.remoteControl.enterFullscreen(event);
    }
  }
}

/**
 * @readonly
 * @type {import('./types').FullscreenButtonElementStorybookArgTypes}
 */
export const FULLSCREEN_BUTTON_ELEMENT_STORYBOOK_ARG_TYPES = {
  ...TOGGLE_BUTTON_ELEMENT_STORYBOOK_ARG_TYPES,
  label: { control: StorybookControlType.Text, defaultValue: 'Fullscreen' },
  pressed: { control: StorybookControlType.Boolean, table: { disable: true } },
  mediaFullscreen: {
    control: StorybookControlType.Boolean,
    defaultValue: false
  },
  onVdsEnterFullscreenRequest: storybookAction(
    EnterFullscreenRequestEvent.TYPE
  ),
  onVdsExitFullscreenRequest: storybookAction(ExitFullscreenRequestEvent.TYPE)
};
