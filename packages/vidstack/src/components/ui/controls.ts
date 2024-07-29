import { Component, effect } from 'maverick.js';
import { DOMEvent, setAttribute, setStyle } from 'maverick.js/std';

import { useMediaContext, type MediaContext } from '../../core/api/media-context';
import { setAttributeIfEmpty } from '../../utils/dom';

/**
 * This component creates a container for control groups.
 *
 * @attr data-visible - Whether controls should be visible.
 * @attr data-pip - Whether picture-in-picture mode is active.
 * @attr data-fullscreen - Whether fullscreen mode is active.
 * @docs {@link https://www.vidstack.io/docs/player/components/media/controls}
 */
export class Controls extends Component<ControlsProps, {}, ControlsEvents> {
  static props: ControlsProps = {
    hideDelay: 2000,
    hideOnMouseLeave: false,
  };

  #media!: MediaContext;

  protected override onSetup(): void {
    this.#media = useMediaContext();
    effect(this.#watchProps.bind(this));
  }

  protected override onAttach(el: HTMLElement): void {
    const { pictureInPicture, fullscreen } = this.#media.$state;

    setStyle(el, 'pointer-events', 'none');
    setAttributeIfEmpty(el, 'role', 'group');

    this.setAttributes({
      'data-visible': this.#isShowing.bind(this),
      'data-fullscreen': fullscreen,
      'data-pip': pictureInPicture,
    });

    effect(() => {
      this.dispatch('change', { detail: this.#isShowing() });
    });

    effect(this.#hideControls.bind(this));

    effect(() => {
      const isFullscreen = fullscreen();
      for (const side of ['top', 'right', 'bottom', 'left']) {
        setStyle(el, `padding-${side}`, isFullscreen && `env(safe-area-inset-${side})`);
      }
    });
  }

  #hideControls() {
    if (!this.el) return;

    const { nativeControls } = this.#media.$state,
      isHidden = nativeControls();

    setAttribute(this.el, 'aria-hidden', isHidden ? 'true' : null);
    setStyle(this.el, 'display', isHidden ? 'none' : null);
  }

  #watchProps() {
    const { controls } = this.#media.player,
      { hideDelay, hideOnMouseLeave } = this.$props;

    // Use controls delay prop on player if this is the default value.
    controls.defaultDelay = hideDelay() === 2000 ? this.#media.$props.controlsDelay() : hideDelay();
    controls.hideOnMouseLeave = hideOnMouseLeave();
  }

  #isShowing() {
    const { controlsVisible } = this.#media.$state;
    return controlsVisible();
  }
}

export interface ControlsProps {
  /**
   * The default amount of delay in milliseconds while media playback is progressing without user
   * activity to hide the controls.
   */
  hideDelay: number;
  /**
   * Whether controls visibility should be toggled when the mouse enters and leaves the player
   * container.
   */
  hideOnMouseLeave: boolean;
}

export interface ControlsEvents {
  change: ControlsChangeEvent;
}

/**
 * Fired when the active state of the controls change.
 *
 * @detail isVisible
 */
export interface ControlsChangeEvent extends DOMEvent<boolean> {}
