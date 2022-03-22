import { createIntersectionController, isUndefined, preconnect } from '@vidstack/foundation';
import { css, CSSResultGroup, html, LitElement, TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import { MediaRemoteControl, mediaStoreSubscription } from '../../media';

const didPreconnect = new Set();

/**
 * Loads and displays the current media poster image. By default, the media provider's
 * loading strategy is respected, otherwise you can specify `eager` or `lazy`.
 *
 * 💡 The following img attributes are applied:
 *
 * - `img-loading`: When the poster image is in the process of being downloaded by the browser.
 * - `img-loaded`: When the poster image has successfully loaded.
 * - `img-error`: When the poster image has failed to load.
 *
 * @tagname vds-poster
 * @csspart img - The img element.
 * @example
 * ```html
 * <vds-media>
 *   <vds-poster
 *     alt="Large alien ship hovering over New York."
 *   ></vds-poster>
 * </vds-media>
 * ```
 * @example
 * ```css
 * vds-poster {
 *   position: absolute;
 *   top: 0;
 *   left: 0;
 *   width: 100%;
 *   height: 100%;
 * }
 * ```
 */
export class PosterElement extends LitElement {
  static override get styles(): CSSResultGroup {
    return [
      css`
        :host {
          display: block;
          contain: content;
          pointer-events: none;
          object-fit: cover;
          box-sizing: border-box;
        }

        :host([hidden]) {
          display: none;
        }

        img {
          display: block;
          width: 100%;
          height: 100%;
          pointer-events: none;
          object-fit: inherit;
          object-position: inherit;
          user-select: none;
          -webkit-user-select: none;
          box-sizing: border-box;
        }
      `,
    ];
  }

  constructor() {
    super();

    mediaStoreSubscription(this, 'currentPoster', ($poster) => {
      window.requestAnimationFrame(() => {
        if (!this.__canLoad && !didPreconnect.has($poster)) {
          preconnect($poster, 'prefetch');
          didPreconnect.add($poster);
        }
      });

      this.__src = $poster;

      if (this.__canLoad) {
        this._setImgLoadingAttr();
      }
    });

    mediaStoreSubscription(this, 'canLoad', ($canLoad) => {
      if (isUndefined(this.loading)) {
        this._handleCanLoadChange($canLoad);
      }
    });

    const intersectionController = createIntersectionController(
      this,
      { threshold: 0 },
      (entries) => {
        if (this.loading !== 'lazy') {
          intersectionController.hostDisconnected();
          return;
        }

        if (entries[0]?.isIntersecting) {
          this._handleCanLoadChange(true);
          intersectionController.hostDisconnected();
        }
      },
    );
  }

  // -------------------------------------------------------------------------------------------
  // Properties
  // -------------------------------------------------------------------------------------------

  @state() protected __src?: string;
  @state() protected __canLoad = false;

  /**
   * The URL of the current poster resource.
   *
   * @default undefined
   */
  get src() {
    return this.__src;
  }

  /**
   * Whether the poster should be loaded immediately, or once it has entered the viewport.
   * By default it is `undefined`, in which it falls back to respecting the loading strategy
   * defined on the media provider element.
   *
   * @default undefined
   */
  @property() loading?: 'eager' | 'lazy';

  /**
   * ♿ **ARIA:** Provides alternative information for a poster image if a user for some reason
   * cannot view it.
   *
   * @default undefined
   */
  @property() alt?: string;

  // -------------------------------------------------------------------------------------------
  // Lifecycle
  // -------------------------------------------------------------------------------------------

  protected _mediaRemoteControl = new MediaRemoteControl(this);

  override connectedCallback(): void {
    super.connectedCallback();

    if (this.loading === 'eager') {
      this._handleCanLoadChange(true);
    }

    this._mediaRemoteControl.hidePoster();
  }

  override disconnectedCallback(): void {
    this._mediaRemoteControl.showPoster();
    super.disconnectedCallback();
    this.__src = undefined;
    this._handleCanLoadChange(false);
  }

  protected override render(): TemplateResult {
    return html`
      <img
        part="img"
        src=${ifDefined(this.__canLoad ? this.src : null)}
        alt=${ifDefined(this.alt)}
        @load=${this._handleImgLoad}
        @error=${this._handleImgError}
      />
    `;
  }

  // -------------------------------------------------------------------------------------------
  // Handlers
  // -------------------------------------------------------------------------------------------

  protected _setImgLoadingAttr() {
    this.removeAttribute('img-error');
    this.removeAttribute('img-loaded');
    if (this.__canLoad && this.src) {
      this.setAttribute('img-loading', '');
    }
  }

  protected _handleImgLoad() {
    this.removeAttribute('img-loading');
    this.setAttribute('img-loaded', '');
  }

  protected _handleImgError() {
    this.removeAttribute('img-loading');
    this.setAttribute('img-error', '');
  }

  protected _handleCanLoadChange(canLoad: boolean) {
    if (canLoad) {
      this._setImgLoadingAttr();
    } else {
      this.removeAttribute('img-error');
      this.removeAttribute('img-loaded');
      this.removeAttribute('img-loading');
    }

    this.__canLoad = canLoad;
  }
}
