import { CSSResultGroup, html, LitElement, TemplateResult } from 'lit';

import { watchContext } from '../../base/context';
import {
  controlsContext,
  ManagedControls,
  mediaContext,
  ViewType
} from '../../media';
import { setAttribute } from '../../utils/dom';
import { controlsElementStyles } from './styles';

export const CONTROLS_ELEMENT_TAG_NAME = 'vds-controls';

/**
 * Container for holding individual media controls.
 *
 * 💡 The following attributes are updated for your styling needs:
 *
 * - `hidden`: Applied when the controls should be hidden and not available to the user.
 * - `idle`: Applied when there is no user activity for a given period, `hidden` should have greater priority.
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
 * vds-controls[hidden] {
 *   display: none;
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

  protected readonly _managedControls = new ManagedControls(this);

  protected override render(): TemplateResult {
    return html`<slot></slot>`;
  }

  @watchContext(controlsContext.hidden)
  protected _handleControlsHiddenContextUpdate(hidden: boolean) {
    setAttribute(this, 'hidden', hidden);
  }

  @watchContext(controlsContext.idle)
  protected _handleControlsIdleContextUpdate(idle: boolean) {
    setAttribute(this, 'idle', idle);
  }

  @watchContext(mediaContext.canPlay)
  protected _handleCanPlayContextUpdate(canPlay: boolean) {
    setAttribute(this, 'media-can-play', canPlay);
  }

  @watchContext(mediaContext.paused)
  protected _handlePausedContextUpdate(paused: boolean) {
    setAttribute(this, 'media-paused', paused);
  }

  @watchContext(mediaContext.viewType)
  protected _handleViewTypeContextUpdate(viewType: ViewType) {
    setAttribute(this, 'media-view-type', viewType);
  }
}
