import {
  storybookAction,
  StorybookControl
} from '../../../foundation/storybook/index.js';
import {
  mediaContext,
  MediaRemoteControl,
  MuteRequestEvent,
  UnmuteRequestEvent
} from '../../../media/index.js';
import {
  TOGGLE_BUTTON_ELEMENT_STORYBOOK_ARG_TYPES,
  ToggleButtonElement
} from '../toggle-button/index.js';

export const MUTE_BUTTON_ELEMENT_TAG_NAME = 'vds-mute-button';

/**
 * A button for toggling the muted state of the player.
 *
 * @tagname vds-mute-button
 * @slot mute - The content to show when the `muted` state is `false`.
 * @slot unmute - The content to show when the `muted` state is `true`.
 * @csspart button - The root button (`<vds-button>`).
 * @csspart button-* - All `vds-button` parts re-exported with the `button` prefix.
 * @example
 * ```html
 * <vds-mute-button>
 *   <!-- Showing -->
 *   <div slot="mute"></div>
 *   <!-- Hidden - `hidden` attribute will automatically be applied/removed -->
 *   <div slot="unmute" hidden></div>
 * </vds-mute-button>
 * ```
 */
export class MuteButtonElement extends ToggleButtonElement {
  /**
   * @protected
   * @readonly
   */
  remoteControl = new MediaRemoteControl(this);

  constructor() {
    super();

    // Properties
    this.label = 'Mute';
    /**
     * @internal
     * @type {boolean}
     */
    this.pressed = mediaContext.muted.initialValue;
  }

  /** @type {import('../../../foundation/context').ContextConsumerDeclarations} */
  static get contextConsumers() {
    return {
      pressed: mediaContext.muted
    };
  }

  /**
   * The `mute` slotted element.
   *
   * @type {HTMLElement | undefined}
   */
  get muteSlotElement() {
    return this.currentNotPressedSlotElement;
  }

  /**
   * The `unmute` slotted element.
   *
   * @type {HTMLElement | undefined}
   */
  get unmuteSlotElement() {
    return this.currentPressedSlotElement;
  }

  getPressedSlotName() {
    return 'unmute';
  }

  getNotPressedSlotName() {
    return 'mute';
  }

  handleButtonClick(event) {
    if (this.pressed) {
      this.remoteControl.unmute(event);
    } else {
      this.remoteControl.mute(event);
    }
  }
}

export const MUTE_BUTTON_ELEMENT_STORYBOOK_ARG_TYPES = {
  ...TOGGLE_BUTTON_ELEMENT_STORYBOOK_ARG_TYPES,
  label: { control: StorybookControl.Text, defaultValue: 'Mute' },
  pressed: { control: StorybookControl.Boolean, table: { disable: true } },
  mediaMuted: {
    control: StorybookControl.Boolean,
    defaultValue: false
  },
  onMuteRequest: storybookAction(MuteRequestEvent.TYPE),
  onUnmuteRequest: storybookAction(UnmuteRequestEvent.TYPE)
};
