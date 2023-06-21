import { Component } from 'maverick.js';
import { setStyle } from 'maverick.js/std';

/**
 * This component creates a container for media controls.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/media/controls#group}
 */
export class ControlsGroup extends Component {
  protected override onAttach(el: HTMLElement): void {
    setStyle(el, 'pointer-events', 'auto');
  }
}
