import { debounce, DisposalBin, eventListener, listen, vdsEvent } from '@vidstack/foundation';
import { html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';

import type { MediaVolumeChange, MediaVolumeChangeEvent } from '../events';
import type { MediaProviderElement } from '../provider';

const mediaProviders = new Set<MediaProviderElement>();

let syncingMediaPlayback = false;
let syncingMediaVolume = false;

/**
 * This element is responsible for synchronizing elements of the type `MediaProviderElement`.
 *
 * Synchronization includes:
 *
 * - Single media playback (eg: user plays a video while another is already playing, so we pause
 * the newly inactive player).
 *
 * - Shared media volume (eg: user sets desired volume to 50% on one player, and they expect it to
 * be consistent across all players).
 *
 * - Saving media volume to local storage (eg: user sets desired to volume 50%, they leave
 * the site, and when they come back they expect it to be 50% without any interaction).
 *
 * @tagname vds-media-sync
 * @slot - Used to pass in content, typically a media player/provider.
 * @events ./media-sync.events.ts
 * @example
 * ```html
 * <vds-media-sync
 *   single-playback
 *   shared-volume
 *   volume-storage-key="@vidstack/volume"
 * >
 *   <!-- ... -->
 * </vds-media-sync>
 * ```
 */
export class MediaSyncElement extends LitElement {
  /**
   * Whether only one is player should be playing at a time.
   *
   * @default false
   */
  @property({ type: Boolean, attribute: 'single-playback' })
  singlePlayback = false;

  /**
   * Whether media volume should be in-sync across all media players.
   *
   * @default false
   */
  @property({ type: Boolean, attribute: 'shared-volume' })
  sharedVolume = false;

  /**
   * If a value is provided, volume will be saved to local storage to the given key as it's
   * updated. In addition, when a media provider connects to the manager, it's volume will be
   * set to the saved volume level. If no value is provided, nothing is saved or retrieved.
   *
   * Note that this includes both the volume and muted state.
   *
   * @default undefined
   */
  @property({ attribute: 'volume-storage-key' })
  volumeStorageKey?: string;

  // -------------------------------------------------------------------------------------------
  // Lifecycle
  // -------------------------------------------------------------------------------------------

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._mediaProviderDisposal.empty();
  }

  override render() {
    return html`<slot></slot>`;
  }

  // -------------------------------------------------------------------------------------------
  // Media Provider Connect
  // -------------------------------------------------------------------------------------------

  protected _mediaProvider?: MediaProviderElement;
  protected _mediaProviderDisposal = new DisposalBin();

  get mediaProvider() {
    return this._mediaProvider;
  }

  protected _handleMediaProviderConnect = eventListener(
    this,
    'vds-media-provider-connect',
    (event) => {
      const { element, onDisconnect } = event.detail;

      this._mediaProvider = element;
      mediaProviders.add(element);

      const savedVolume = this._getSavedMediaVolume();
      if (savedVolume) {
        this._mediaProvider._volume = savedVolume.volume;
        this._mediaProvider._muted = savedVolume.muted;
      }

      if (this.singlePlayback) {
        const off = listen(element, 'vds-play', this._handleMediaPlay.bind(this));
        this._mediaProviderDisposal.add(off);
      }

      if (this.sharedVolume) {
        const off = listen(
          element,
          'vds-volume-change',
          debounce(this._handleMediaVolumeChange.bind(this), 10, true),
        );

        this._mediaProviderDisposal.add(off);
      }

      if (this.volumeStorageKey) {
        const off = listen(element, 'vds-volume-change', this._saveMediaVolume.bind(this));

        this._mediaProviderDisposal.add(off);
      }

      this._mediaProviderDisposal.add(() => {
        mediaProviders.delete(element);
        this._mediaProvider = undefined;
      });

      onDisconnect(() => {
        this._mediaProviderDisposal.empty();
      });
    },
  );

  // -------------------------------------------------------------------------------------------
  // Playback
  // -------------------------------------------------------------------------------------------

  protected _handleMediaPlay() {
    if (syncingMediaPlayback) return;

    syncingMediaPlayback = true;

    mediaProviders.forEach((provider) => {
      if (provider !== this._mediaProvider) {
        provider._paused = true;
      }
    });

    syncingMediaPlayback = false;
  }

  // -------------------------------------------------------------------------------------------
  // Volume
  // -------------------------------------------------------------------------------------------

  protected _handleMediaVolumeChange(event: MediaVolumeChangeEvent) {
    if (syncingMediaVolume) return;
    syncingMediaVolume = true;

    const { volume, muted } = event.detail;

    mediaProviders.forEach((provider) => {
      if (provider !== this._mediaProvider) {
        provider._volume = volume;
        provider._muted = muted;
      }
    });

    this.dispatchEvent(
      vdsEvent('vds-media-volume-sync', {
        bubbles: true,
        composed: true,
        detail: event.detail,
      }),
    );

    syncingMediaVolume = false;
  }

  protected _getSavedMediaVolume(): MediaVolumeChange | undefined {
    if (!this.volumeStorageKey) return;

    try {
      return JSON.parse(localStorage.getItem(this.volumeStorageKey)!);
    } catch (e) {
      return undefined;
    }
  }

  protected _saveMediaVolume(event: MediaVolumeChangeEvent) {
    if (!this.volumeStorageKey) return;
    localStorage.setItem(this.volumeStorageKey, JSON.stringify(event.detail));
  }
}
