import { CSSResultGroup, PropertyValues } from 'lit';

import { DisposalBin, hostedEventListener, listen } from '../../base/events';
import { logElementLifecycle } from '../../base/logger';
import { get } from '../../base/stores';
import { hostedMediaStoreSubscription } from '../../media';
import { setAttribute } from '../../utils/dom';
import { isNil } from '../../utils/unit';
import {
  ScrubberPreviewElement,
  ScrubberPreviewHideEvent,
  ScrubberPreviewShowEvent,
  ScrubberPreviewTimeUpdateEvent
} from '../scrubber-preview';
import { TimeSliderElement } from '../time-slider';
import { scrubberStoreContext } from './scrubberStore';
import { scrubberElementStyles } from './styles';

/**
 * Extends `TimeSliderElement` and adds support for "previews". A preview is essentially
 * a sneak peek of a certain time the user is interacting with on the time slider.
 *
 * 💡 The following attributes are updated for your styling needs:
 *
 * - `media-can-play`: Applied when media can begin playback.
 * - `media-waiting`: Applied when playback has stopped because of a lack of temporary data.
 *
 * 💡 See the `<vds-scrubber-preview>` element if you'd like to include previews.
 *
 * @tagname vds-scrubber
 * @slot Used to pass content into the slider.
 */
export class ScrubberElement extends TimeSliderElement {
  static override get styles(): CSSResultGroup {
    return [super.styles, scrubberElementStyles];
  }

  constructor() {
    super();

    if (__DEV__) {
      logElementLifecycle(this);
    }

    hostedMediaStoreSubscription(this, 'canPlay', ($canPlay) => {
      setAttribute(this, 'media-can-play', $canPlay);
    });
    hostedMediaStoreSubscription(this, 'waiting', ($waiting) => {
      setAttribute(this, 'media-waiting', $waiting);
    });
  }

  // -------------------------------------------------------------------------------------------
  // Properties
  // -------------------------------------------------------------------------------------------

  protected readonly _scrubberStoreProvider =
    scrubberStoreContext.provide(this);

  get scrubberStore() {
    return this._scrubberStoreProvider.value;
  }

  // -------------------------------------------------------------------------------------------
  // Lifecycle
  // -------------------------------------------------------------------------------------------

  protected override update(changedProperties: PropertyValues) {
    if (changedProperties.has('disabled')) {
      if (this.disabled) {
        this.scrubberPreviewElement?.hidePreview();
      }

      if (!isNil(this.scrubberPreviewElement)) {
        this.scrubberPreviewElement.disabled = this.disabled;
      }
    }

    if (changedProperties.has('hidden')) {
      if (!isNil(this.scrubberPreviewElement)) {
        this.scrubberPreviewElement.hidden = this.hidden;
      }
    }

    super.update(changedProperties);
  }

  // -------------------------------------------------------------------------------------------
  // Scrubber Events
  // -------------------------------------------------------------------------------------------

  protected _handleScrubberPointerEnter = hostedEventListener(
    this,
    'pointerenter',
    (event) => {
      if (this.disabled) return;
      this.scrubberStore.pointing.set(true);
      this._scrubberStoreProvider;
      this.setAttribute('pointing', '');
      this.scrubberPreviewElement?.showPreview(event);
    }
  );

  protected _handleScrubberPointerMove = hostedEventListener(
    this,
    'pointermove',
    (event) => {
      if (this.disabled || get(this.scrubberStore.dragging)) return;
      this.scrubberPreviewElement?.updatePreviewPosition(event);
    }
  );

  protected _handleScrubberPointerLeave = hostedEventListener(
    this,
    'pointerleave',
    (event) => {
      if (this.disabled) return;

      this.scrubberStore.pointing.set(false);
      this.removeAttribute('pointing');

      if (!get(this.scrubberStore.dragging)) {
        this.scrubberPreviewElement?.hidePreview(event);
      }
    }
  );

  protected _handleScrubberDragStart = hostedEventListener(
    this,
    'vds-slider-drag-start',
    (event) => {
      if (this.disabled) return;
      this.scrubberStore.dragging.set(true);
      this.setAttribute('dragging', '');
      this.scrubberPreviewElement?.showPreview(event);
    }
  );

  protected _handleScrubberValueChange = hostedEventListener(
    this,
    'vds-slider-value-change',
    (event) => {
      if (this.disabled) return;
      this.scrubberPreviewElement?.updatePreviewPosition(event);
    }
  );

  protected _handleScrubberDragEnd = hostedEventListener(
    this,
    'vds-slider-drag-end',
    (event) => {
      if (this.disabled) return;
      this.scrubberStore.dragging.set(false);
      this.removeAttribute('dragging');
      if (!get(this.scrubberStore.pointing))
        this.scrubberPreviewElement?.hidePreview(event);
    }
  );

  // -------------------------------------------------------------------------------------------
  // Scrubber Preview
  // -------------------------------------------------------------------------------------------

  protected _scrubberPreviewElement: ScrubberPreviewElement | undefined;

  /**
   * The scrubber preview element `<vds-scrubber-preview>` (if given).
   */
  get scrubberPreviewElement() {
    return this._scrubberPreviewElement;
  }

  protected readonly _scrubberPreviewDisconnectDisposal = new DisposalBin();

  protected readonly _handlePreviewConnect = hostedEventListener(
    this,
    'vds-scrubber-preview-connect',
    (event) => {
      event.stopPropagation();

      const { element, onDisconnect } = event.detail;

      this._scrubberPreviewElement = element;
      this.setAttribute('previewable', '');

      this._scrubberPreviewDisconnectDisposal.add(
        listen(
          element,
          'vds-scrubber-preview-show',
          this._handlePreviewShow.bind(this)
        ),
        listen(
          element,
          'vds-scrubber-preview-time-update',
          this._handlePreviewTimeUpdate.bind(this)
        ),
        listen(
          element,
          'vds-scrubber-preview-hide',
          this._handlePreviewHide.bind(this)
        )
      );

      onDisconnect(() => {
        this._scrubberPreviewDisconnectDisposal.empty();
        this._scrubberPreviewElement = undefined;
        this.removeAttribute('previewable');
      });
    }
  );

  protected _handlePreviewShow(event: ScrubberPreviewShowEvent) {
    event.stopPropagation();
    this.setAttribute('previewing', '');
  }

  protected _handlePreviewTimeUpdate(event: ScrubberPreviewTimeUpdateEvent) {
    event.stopPropagation();
  }

  protected _handlePreviewHide(event: ScrubberPreviewHideEvent) {
    event.stopPropagation();
    this.removeAttribute('previewing');
  }
}
