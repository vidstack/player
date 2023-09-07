import { Component, effect } from 'maverick.js';
import { DOMEvent, setStyle } from 'maverick.js/std';

import { useMediaContext, type MediaContext } from '../../core/api/media-context';
import { setAttributeIfEmpty } from '../../utils/dom';

/**
 * This component creates a container for control groups.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/media/controls}
 */
export class Controls extends Component<ControlsProps, {}, ControlsEvents> {
  static props: ControlsProps = {
    hideDelay: 2000,
  };

  private _media!: MediaContext;

  protected override onSetup(): void {
    this._media = useMediaContext();
    effect(this._watchHideDelay.bind(this));
  }

  protected override onAttach(el: HTMLElement): void {
    const { fullscreen } = this._media.$state;

    setStyle(el, 'pointer-events', 'none');
    setAttributeIfEmpty(el, 'role', 'group');

    this.setAttributes({
      'data-showing': this._isShowing.bind(this),
      'data-fullscreen': fullscreen,
    });

    effect(() => {
      this.dispatch('change', { detail: this._isShowing() });
    });

    effect(() => {
      const isFullscreen = fullscreen();
      for (const side of ['top', 'right', 'bottom', 'left']) {
        setStyle(el, `padding-${side}`, isFullscreen && `env(safe-area-inset-${side})`);
      }
    });
  }

  private _watchHideDelay() {
    const { controls } = this._media.player,
      { hideDelay } = this.$props;
    controls.defaultDelay = hideDelay();
  }

  private _isShowing() {
    const { controlsVisible } = this._media.$state;
    return controlsVisible();
  }
}

export interface ControlsProps {
  /**
   * The default amount of delay in milliseconds while media playback is progressing without user
   * activity to hide the controls.
   */
  hideDelay: number;
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
