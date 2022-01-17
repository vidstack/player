import { CSSResultGroup, html, LitElement, TemplateResult } from 'lit';

import { logElementLifecycle } from '../../base/logger';
import { hostedMediaStoreSubscription } from '../../media';
import { setAttribute } from '../../utils/dom';
import { controlsElementStyles } from './styles';

/**
 * Container for holding individual media controls.
 *
 * 💡 The following attributes are updated for your styling needs:
 *
 * - `media-idle`: Applied when there is no user activity for a set period of time.
 * - `media-can-play`: Applied when media can begin playback.
 * - `media-paused`: Applied when media is paused.
 * - `media-view-type`: Applied with the media view type such as `audio` or `video`.
 * - `media-autoplay-error`: Applied when media autoplay fails. It can be used to show recovery UI
 * if controls are hidden.
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
 * vds-controls[idle],
 * vds-controls:not([media-can-play]) {
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

    hostedMediaStoreSubscription(this, 'canPlay', ($canPlay) => {
      setAttribute(this, 'media-can-play', $canPlay);
    });
    hostedMediaStoreSubscription(this, 'idle', ($idle) => {
      setAttribute(this, 'media-idle', $idle);
    });
    hostedMediaStoreSubscription(this, 'paused', ($paused) => {
      setAttribute(this, 'media-paused', $paused);
    });
    hostedMediaStoreSubscription(this, 'viewType', ($viewType) => {
      setAttribute(this, 'media-view-type', $viewType);
    });
    hostedMediaStoreSubscription(this, 'autoplayError', ($autoplayError) => {
      setAttribute(this, 'media-autoplay-error', !!$autoplayError);
    });
  }

  protected override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}
