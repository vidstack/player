import { CSSResultGroup, html, LitElement, TemplateResult } from 'lit';

import { logElementLifecycle } from '../../base/logger';
import { controlsElementStyles } from './styles';

/**
 * Container for holding individual media controls.
 *
 * 💡 The following attributes are updated for your styling needs:
 *
 * - `hidden`: Applied when the controls should be hidden and not available to the user.
 * - `idle`: Applied when there is no user activity for a set period, `hidden` should have greater priority.
 * - `media-autoplay-error`: Applied when media autoplay fails. It can be used to show recovery UI
 * if controls are hidden.
 * - `media-can-play`: Applied when media can begin playback.
 * - `media-paused`: Applied when media is paused.
 * - `media-view-type`: Applied with the media view type such as `audio` or `video`.
 *
 * @tagname vds-controls
 * @slot Used to pass in controls.
 * @example
 * ```html
 * <vds-controls>
 *   <vds-play-button></vds-play-button>
 *   <vds-scrubber></vds-scrubber>
 *   <vds-fullscreen-button></vds-fullscreen-button>
 * </vds-controls>
 * ```
 * @example
 * ```css
 * vds-controls {
 *   opacity: 1;
 *   transition: opacity 0.3s ease-out;
 * }
 *
 * vds-controls[idle] {
 *   opacity: 0;
 * }
 * ```
 */
export class ControlsElement extends LitElement {
  static override get styles(): CSSResultGroup {
    return [controlsElementStyles];
  }

  constructor() {
    super();
    if (__DEV__) {
      logElementLifecycle(this);
    }
  }

  protected override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}
