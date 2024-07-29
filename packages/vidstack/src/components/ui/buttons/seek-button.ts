import { Component } from 'maverick.js';

import { useMediaContext, type MediaContext } from '../../../core/api/media-context';
import type { MediaRequestEvents } from '../../../core/api/media-request-events';
import { FocusVisibleController } from '../../../foundation/observers/focus-visible';
import { $ariaBool } from '../../../utils/aria';
import { onPress, setARIALabel, setAttributeIfEmpty } from '../../../utils/dom';

export interface SeekButtonProps {
  /**
   * Whether the button should be disabled (non-interactive).
   */
  disabled: boolean;
  /**
   * The amount to seek the media playback forwards (positive number) or backwards (negative number)
   * when the seek button is pressed.
   */
  seconds: number;
}

export interface SeekButtonEvents extends Pick<MediaRequestEvents, 'media-seek-request'> {}

/**
 * A button for seeking the current media playback forwards or backwards by a specified amount.
 *
 * @attr data-seeking - Whether a seeking operation is in progress.
 * @attr data-supported - Whether seeking operations are permitted.
 * @attr data-focus - Whether button is being keyboard focused.
 * @attr data-hocus - Whether button is being keyboard focused or hovered over.
 * @docs {@link https://www.vidstack.io/docs/player/components/buttons/seek-button}
 */
export class SeekButton extends Component<SeekButtonProps, {}, SeekButtonEvents> {
  static props: SeekButtonProps = {
    disabled: false,
    seconds: 30,
  };

  #media!: MediaContext;

  constructor() {
    super();
    new FocusVisibleController();
  }

  protected override onSetup(): void {
    this.#media = useMediaContext();

    const { seeking } = this.#media.$state,
      { seconds } = this.$props,
      isSupported = this.#isSupported.bind(this);

    this.setAttributes({
      seconds,
      'data-seeking': seeking,
      'data-supported': isSupported,
      'aria-hidden': $ariaBool(() => !isSupported()),
    });
  }

  protected override onAttach(el: HTMLElement) {
    setAttributeIfEmpty(el, 'tabindex', '0');
    setAttributeIfEmpty(el, 'role', 'button');
    setAttributeIfEmpty(el, 'type', 'button');
    el.setAttribute('data-media-tooltip', 'seek');
    setARIALabel(el, this.#getDefaultLabel.bind(this));
  }

  protected override onConnect(el: HTMLElement) {
    onPress(el, this.#onPress.bind(this));
  }

  #isSupported() {
    const { canSeek } = this.#media.$state;
    return canSeek();
  }

  #getDefaultLabel() {
    const { seconds } = this.$props;
    return `Seek ${seconds() > 0 ? 'forward' : 'backward'} ${seconds()} seconds`;
  }

  #onPress(event: Event) {
    const { seconds, disabled } = this.$props;

    if (disabled()) return;

    const { currentTime } = this.#media.$state,
      seekTo = currentTime() + seconds();

    this.#media.remote.seek(seekTo, event);
  }
}
