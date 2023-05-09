import {
  Component,
  ComponentInstance,
  defineElement,
  type HTMLCustomElement,
} from 'maverick.js/element';
import { seekBackwardPaths, seekForwardPaths } from 'media-icons';

import { FocusVisibleController } from '../../../foundation/observers/focus-visible';
import { Icon } from '../../../icons/icon';
import { $ariaBool } from '../../../utils/aria';
import { onPress, setARIALabel, setAttributeIfEmpty } from '../../../utils/dom';
import { useMedia, type MediaContext } from '../../core/api/context';
import { TooltipController } from '../tooltip/tooltip-controller';

declare global {
  interface MaverickElements {
    'media-seek-button': MediaSeekButtonElement;
  }
}

/**
 * A button for seeking the current media playback forwards or backwards by a specified amount.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/buttons/seek-button}
 * @slot forward - Used to override the default seek forward icon.
 * @slot backward - Used to override the default seek backward icon.
 * @example
 * ```html
 * <!-- Forward +30s on each press. -->
 * <media-seek-button seconds="+30"></media-seek-button>
 * <!-- Backward -30s on each press. -->
 * <media-seek-button seconds="-30"></media-seek-button>
 * ```
 */
export class SeekButton extends Component<SeekButtonAPI> {
  static el = defineElement<SeekButtonAPI>({
    tagName: 'media-seek-button',
    props: {
      disabled: false,
      defaultAppearance: false,
      seconds: 30,
    },
  });

  protected _media: MediaContext;

  constructor(instance: ComponentInstance<SeekButtonAPI>) {
    super(instance);
    this._media = useMedia();
    new FocusVisibleController(instance);
    new TooltipController(instance);
  }

  protected override onAttach(el: HTMLElement) {
    setAttributeIfEmpty(el, 'tabindex', '0');
    setAttributeIfEmpty(el, 'role', 'button');

    setARIALabel(el, this._getLabel.bind(this));

    const { seconds, defaultAppearance } = this.$props;
    this.setAttributes({
      seconds,
      'default-appearance': defaultAppearance,
      'aria-hidden': $ariaBool(this._isHidden.bind(this)),
      'data-media-button': true,
    });
  }

  protected override onConnect(el: HTMLElement) {
    onPress(el, this._onPress.bind(this));
  }

  protected _isHidden() {
    const { canSeek } = this._media.$store;
    return !canSeek();
  }

  protected _getLabel() {
    const { seconds } = this.$props;
    return `Seek ${seconds() > 0 ? 'forward' : 'backward'} ${seconds()} seconds`;
  }

  protected _onPress(event: Event) {
    const { seconds, disabled } = this.$props;

    if (disabled()) return;

    const { currentTime } = this._media.$store,
      seekTo = currentTime() + seconds();

    this._media.remote.seek(seekTo, event);
  }

  override render() {
    return (
      <>
        <Icon paths={seekBackwardPaths} slot="backward" />
        <Icon paths={seekForwardPaths} slot="forward" />
      </>
    );
  }
}

export interface SeekButtonAPI {
  props: SeekButtonProps;
}

export interface SeekButtonProps {
  /**
   * Whether the button should be disabled (non-interactive).
   */
  disabled: boolean;
  /**
   * Whether the default button appearance should stay visible when elements have been passed inside
   * it.
   */
  defaultAppearance: boolean;
  /**
   * The amount to seek the media playback forwards (positive number) or backwards (negative number)
   * when the seek button is pressed.
   */
  seconds: number;
}

export interface MediaSeekButtonElement extends HTMLCustomElement<SeekButton> {}
