import {
  storybookAction,
  StorybookControlType
} from '../../../foundation/storybook/index.js';
import {
  EnterFullscreenRequestEvent,
  ExitFullscreenRequestEvent,
  mediaContext,
  MediaRemoteControl
} from '../../../media/index.js';
import {
  TOGGLE_BUTTON_ELEMENT_STORYBOOK_ARG_TYPES,
  ToggleButtonElement
} from '../toggle-button/index.js';

export const FULLSCREEN_BUTTON_ELEMENT_TAG_NAME = 'vds-fullscreen-button';

/**
 * A button for toggling the fullscreen mode of the player.
 *
 *
 * @tagname vds-fullscreen-button
 * @slot enter - The content to show when the `fullscreen` state is `false`.
 * @slot exit - The content to show when the `fullscreen` state is `true`.
 * @csspart button - The root button (`<vds-button>`).
 * @csspart button-* - All `vds-button` parts re-exported with the `button` prefix.
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
    /**
     * @internal
     * @type {boolean}
     */
    this.pressed = mediaContext.fullscreen.initialValue;
  }

  /** @type {import('../../../foundation/context').ContextConsumerDeclarations} */
  static get contextConsumers() {
    return {
      pressed: mediaContext.fullscreen
    };
  }

  /**
   * The `enter` slotted element.
   *
   * @type {HTMLElement | undefined}
   */
  get enterSlotElement() {
    return this.currentNotPressedSlotElement;
  }

  /**
   * The `exit` slotted element.
   *
   * @type {HTMLElement | undefined}
   */
  get exitSlotElement() {
    return this.currentPressedSlotElement;
  }

  getPressedSlotName() {
    return 'exit';
  }

  getNotPressedSlotName() {
    return 'enter';
  }

  handleButtonClick(event) {
    if (this.pressed) {
      this.remoteControl.exitFullscreen(event);
    } else {
      this.remoteControl.enterFullscreen(event);
    }
  }
}

export const FULLSCREEN_BUTTON_ELEMENT_STORYBOOK_ARG_TYPES = {
  ...TOGGLE_BUTTON_ELEMENT_STORYBOOK_ARG_TYPES,
  label: { control: StorybookControlType.Text, defaultValue: 'Fullscreen' },
  pressed: { control: StorybookControlType.Boolean, table: { disable: true } },
  mediaFullscreen: {
    control: StorybookControlType.Boolean,
    defaultValue: false
  },
  onEnterFullscreenRequest: storybookAction(EnterFullscreenRequestEvent.TYPE),
  onExitFullscreenRequest: storybookAction(ExitFullscreenRequestEvent.TYPE)
};
