import {
  storybookAction,
  StorybookControlType
} from '../../../foundation/storybook/index.js';
import {
  mediaContext,
  MediaRemoteControl,
  PauseRequestEvent,
  PlayRequestEvent
} from '../../../media/index.js';
import {
  TOGGLE_BUTTON_ELEMENT_STORYBOOK_ARG_TYPES,
  ToggleButtonElement
} from '../toggle-button/index.js';
export const PLAY_BUTTON_ELEMENT_TAG_NAME = 'vds-play-button';
/**
 * A button for toggling the playback state (play/pause) of the current media.
 *
 *
 * @tagname vds-play-button
 * @slot play - The content to show when the `paused` state is `true`.
 * @slot pause - The content to show when the `paused` state is `false`.
 * @csspart button - The root button (`<vds-button>`).
 * @csspart button-* - All `vds-button` parts re-exported with the `button` prefix such as `button-root`.
 * @example
 * ```html
 * <vds-play-button>
 *   <!-- Showing -->
 *   <div slot="play"></div>
 *   <!-- Hidden - `hidden` attribute will automatically be applied/removed -->
 *   <div slot="pause" hidden></div>
 * </vds-play-button>
 * ```
 */
export class PlayButtonElement extends ToggleButtonElement {
  constructor() {
    super();
    /**
     * @protected
     * @readonly
     */
    this.remoteControl = new MediaRemoteControl(this);
    // Properties
    this.label = 'Play';
    /**
     * @internal
     * @type {boolean}
     */
    this.pressed = false;
  }
  /** @type {import('../../../foundation/context/types').ContextConsumerDeclarations} */
  static get contextConsumers() {
    return {
      pressed: {
        context: mediaContext.paused,
        // Transforming `paused` to `!paused` to indicate whether playback has initiated/resumed. Can't
        // use `playing` because there could be a buffering delay (we want immediate feedback).
        transform: (p) => !p
      }
    };
  }
  /**
   * The `play` slotted element.
   *
   * @type {HTMLElement | undefined}
   */
  get playSlotElement() {
    return this.currentNotPressedSlotElement;
  }
  /**
   * The `pause` slotted element.
   *
   * @type {HTMLElement | undefined}
   */
  get pauseSlotElement() {
    return this.currentPressedSlotElement;
  }
  getPressedSlotName() {
    return 'pause';
  }
  getNotPressedSlotName() {
    return 'play';
  }
  handleButtonClick(event) {
    if (this.pressed) {
      this.remoteControl.pause(event);
    } else {
      this.remoteControl.play(event);
    }
  }
}
export const PLAY_BUTTON_ELEMENT_STORYBOOK_ARG_TYPES = Object.assign(
  Object.assign({}, TOGGLE_BUTTON_ELEMENT_STORYBOOK_ARG_TYPES),
  {
    label: { control: StorybookControlType.Text, defaultValue: 'Play' },
    pressed: {
      control: StorybookControlType.Boolean,
      table: { disable: true }
    },
    mediaPaused: {
      control: StorybookControlType.Boolean,
      defaultValue: true
    },
    onPlayRequest: storybookAction(PlayRequestEvent.TYPE),
    onPauseRequest: storybookAction(PauseRequestEvent.TYPE)
  }
);
