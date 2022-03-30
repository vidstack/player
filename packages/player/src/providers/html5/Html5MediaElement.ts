import {
  DisposalBin,
  getNumberOfDecimalPlaces,
  getSlottedChildren,
  isNil,
  isNumber,
  isUndefined,
  keysOf,
  listen,
  setAttribute,
  vdsEvent,
} from '@vidstack/foundation';
import { property } from 'lit/decorators.js';

import { MediaProviderElement, MediaType } from '../../media';

export const AUDIO_EXTENSIONS =
  /\.(m4a|mp4a|mpga|mp2|mp2a|mp3|m2a|m3a|wav|weba|aac|oga|spx)($|\?)/i;

export const VIDEO_EXTENSIONS = /\.(mp4|og[gv]|webm|mov|m4v|avi)($|\?)/i;

function getMediaTypeFromExt(src: string) {
  if (AUDIO_EXTENSIONS.test(src)) return MediaType.Audio;
  if (VIDEO_EXTENSIONS.test(src)) return MediaType.Video;
  return MediaType.Unknown;
}

/**
 * This class adapts the underlying media element such as `<audio>` or `<video>` to
 * satisfy the media provider contract, which generally involves providing a consistent API
 * for loading, managing, and tracking media state.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement
 */
export class Html5MediaElement extends MediaProviderElement {
  protected _mediaElement?: HTMLMediaElement;

  get mediaElement() {
    return this._mediaElement;
  }

  // -------------------------------------------------------------------------------------------
  // Lifecycle
  // -------------------------------------------------------------------------------------------

  override disconnectedCallback() {
    this._isMediaWaiting = false;
    super.disconnectedCallback();
    this._cancelTimeUpdates();
  }

  // -------------------------------------------------------------------------------------------
  // Properties
  // -------------------------------------------------------------------------------------------

  /**
   * Configures the preload setting of the underlying media element once it can load (see
   * `loading` property). This will overwrite any existing `preload` value on the `<audio>`
   * or `<video>` element.
   *
   * The `preload` attribute provides a hint to the browser about what the author thinks will
   * lead to the best user experience with regards to what content is loaded before the video is
   * played. The recommended default is `metadata`.
   *
   * @link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video#attr-preload
   * @default 'metadata'
   */
  @property({ reflect: true })
  preload: 'none' | 'metadata' | 'auto' = 'metadata';

  // -------------------------------------------------------------------------------------------
  // Time Updates
  // The `timeupdate` event fires surprisingly infrequently during playback, meaning your progress
  // bar (or whatever else is synced to the currentTime) moves in a choppy fashion. This helps
  // resolve that :)
  // -------------------------------------------------------------------------------------------

  protected _timeRAF?: number = undefined;

  protected _cancelTimeUpdates() {
    if (isNumber(this._timeRAF)) window.cancelAnimationFrame(this._timeRAF);
    this._timeRAF = undefined;
  }

  protected _requestTimeUpdates() {
    // Time updates are already in progress.
    if (!isUndefined(this._timeRAF)) return;
    this._requestTimeUpdate();
  }

  protected _requestTimeUpdate() {
    const newTime = this.mediaElement?.currentTime ?? 0;

    if (this.state.currentTime !== newTime) {
      this._updateCurrentTime(newTime);
    }

    this._timeRAF = window.requestAnimationFrame(() => {
      if (isUndefined(this._timeRAF)) return;
      this._requestTimeUpdate();
    });
  }

  protected _updateCurrentTime(newTime: number, triggerEvent?: Event) {
    this.dispatchEvent(
      vdsEvent('vds-time-update', {
        // Avoid errors where `currentTime` can have higher precision than duration.
        detail: {
          currentTime: Math.min(newTime, this.mediaElement?.duration ?? 0),
          played: this.mediaElement!.played,
        },
        triggerEvent,
      }),
    );
  }

  // -------------------------------------------------------------------------------------------
  // Media Element (Connect)
  // -------------------------------------------------------------------------------------------

  protected _hasMediaElementConnected = false;
  protected _mediaElementDisposal = new DisposalBin();

  handleDefaultSlotChange() {
    // Wait a frame to give events a chance to reach media controller (e.g., `vds-hide-poster-request`).
    window.requestAnimationFrame(() => {
      const mediaElement = getSlottedChildren(this)[0] as HTMLMediaElement | null;
      const tagName = mediaElement?.tagName;

      if (tagName && !/^(audio|video)$/i.test(tagName)) {
        if (__DEV__) {
          throw Error(
            `[vds]: expected <audio> or <video> in default slot. Received: <${tagName}>.`,
          );
        }
      }

      this._handleMediaElementDisconnect();
      this._mediaElement = mediaElement ?? undefined;
      this._handleMediaElementConnect();
    });
  }

  protected get _canMediaElementConnect() {
    return this.canLoad && !isNil(this.mediaElement) && !this._hasMediaElementConnected;
  }

  protected _handleMediaElementConnect() {
    if (!this._canMediaElementConnect) return;

    const mediaEl = this.mediaElement!;

    // Update or remove any attributes that we manage.
    mediaEl.removeAttribute('loop');
    mediaEl.removeAttribute('poster');
    setAttribute(mediaEl, 'controls', this.controls);

    this._attachMediaEventListeners();
    this._observePlaysinline();
    this._observeMediaSources();

    if (this.canLoadPoster && this.poster.length > 0) {
      mediaEl.setAttribute('poster', this.poster);
    }

    this._startPreloadingMedia();

    if (__DEV__) {
      this._logger
        ?.infoGroup('Media element connected')
        .labelledLog('Media Element', mediaEl)
        .dispatch();
    }

    this._hasMediaElementConnected = true;
    this._disconnectDisposal.add(this._handleMediaElementDisconnect.bind(this));
  }

  protected _handleMediaElementDisconnect() {
    this._cancelTimeUpdates();
    this._mediaElementDisposal.empty();
    this._mediaElement = undefined;

    if (this._hasMediaElementConnected && __DEV__) {
      this._logger
        ?.infoGroup('Media element disconnected')
        .labelledLog('Media Element', this.mediaElement)
        .dispatch();
    }

    this._hasMediaElementConnected = false;
  }

  override startLoadingMedia() {
    super.startLoadingMedia();
    this._handleMediaElementConnect();
  }

  protected _startPreloadingMedia() {
    this.mediaElement!.setAttribute('preload', this.preload);

    const isNetworkActive = this.mediaElement!.networkState >= 1;
    this._ignoreNextAbortEvent = isNetworkActive;
    this._ignoreNextEmptiedEvent = isNetworkActive;

    this.mediaElement!.load();

    setTimeout(() => {
      this._ignoreNextAbortEvent = false;
      this._ignoreNextEmptiedEvent = false;
    }, 0);
  }

  protected _observePlaysinline() {
    const isPlayingInline = () => this.mediaElement!.hasAttribute('playsinline');
    this._handlePlaysinlineChange(isPlayingInline());
    const observer = new MutationObserver(() => this._handlePlaysinlineChange(isPlayingInline()));
    observer.observe(this.mediaElement!, { attributeFilter: ['playsinline'] });
    this._mediaElementDisposal.add(() => observer.disconnect());
  }

  protected _handlePlaysinlineChange(playsinline: boolean) {
    this.dispatchEvent(vdsEvent('vds-playsinline-change', { detail: playsinline }));
  }

  protected _observeMediaSources() {
    this._handleSrcChange(this._getMediaSources());
    const observer = new MutationObserver(() => this._handleSrcChange(this._getMediaSources()));
    observer.observe(this.mediaElement!, { attributeFilter: ['src'], subtree: true });
    this._mediaElementDisposal.add(() => observer.disconnect());
  }

  protected _handleSrcChange(sources: string[]) {
    this.dispatchEvent(vdsEvent('vds-src-change', { detail: sources }));
  }

  protected _getMediaSources() {
    const resources = [
      this.mediaElement?.src,
      ...Array.from(this.mediaElement?.querySelectorAll('source') ?? []).map(
        (source) => source.src,
      ),
    ].filter(Boolean);

    // Only uniques.
    return Array.from(new Set(resources)) as string[];
  }

  protected _getMediaMetadata() {
    return {
      src: this.state.src, // Set before metadata is retrieved.
      currentSrc: this.mediaElement!.currentSrc,
      duration: this.mediaElement!.duration || 0,
      poster: (this.mediaElement as HTMLVideoElement).poster,
      mediaType: this._getMediaType(),
      viewType: this.state.viewType,
    };
  }

  // -------------------------------------------------------------------------------------------
  // Events
  // -------------------------------------------------------------------------------------------

  // An un-debounced waiting tracker (this.waiting is debounced inside the media controller).
  protected _isMediaWaiting = false;

  protected _attachMediaEventListeners() {
    if (isNil(this.mediaElement)) return;

    const mediaEventListeners = {
      abort: this._handleAbort,
      canplay: this._handleCanPlay,
      canplaythrough: this._handleCanPlayThrough,
      durationchange: this._handleDurationChange,
      emptied: this._handleEmptied,
      ended: this._handleEnded,
      error: this._handleError,
      loadeddata: this._handleLoadedData,
      loadedmetadata: this._handleLoadedMetadata,
      loadstart: this._handleLoadStart,
      pause: this._handlePause,
      play: this._handlePlay,
      playing: this._handlePlaying,
      progress: this._handleProgress,
      ratechange: this._handleRateChange,
      seeked: this._handleSeeked,
      seeking: this._handleSeeking,
      stalled: this._handleStalled,
      suspend: this._handleSuspend,
      // timeupdate: this._handleTimeUpdate,
      volumechange: this._handleVolumeChange,
      waiting: this._handleWaiting,
    };

    keysOf(mediaEventListeners).forEach((type) => {
      const handler = mediaEventListeners[type].bind(this);

      const off = listen(this.mediaElement!, type, async (event: Event) => {
        if (__DEV__) {
          this._logger
            ?.debugGroup(`📺 fired \`${event.type}\``)
            .labelledLog('Event', event)
            .labelledLog('State', { ...this.state })
            .dispatch();
        }

        await handler(event);
      });

      this._mediaElementDisposal.add(off);
    });

    if (__DEV__) {
      this._logger?.debug('attached event listeners');
    }
  }

  protected _ignoreNextAbortEvent = false;
  protected _handleAbort(event?: Event) {
    if (this._ignoreNextAbortEvent) return;
    this.dispatchEvent(vdsEvent('vds-abort', { triggerEvent: event }));
    this._handleCurrentSrcChange('', event);
  }

  protected _handleCanPlay(event: Event) {
    this._handleMediaReady({ event, duration: this.mediaElement!.duration });
  }

  protected _handleCanPlayThrough(event: Event) {
    if (this.state.started) return;

    this.dispatchEvent(
      vdsEvent('vds-can-play-through', {
        triggerEvent: event,
        detail: { duration: this.mediaElement!.duration },
      }),
    );
  }

  protected _handleLoadStart(event: Event) {
    this._handleCurrentSrcChange(this.mediaElement!.currentSrc, event);

    if (this.mediaElement!.currentSrc === '') {
      this._handleAbort();
      return;
    }

    this.dispatchEvent(
      vdsEvent('vds-load-start', {
        triggerEvent: event,
        detail: this._getMediaMetadata(),
      }),
    );
  }

  protected _ignoreNextEmptiedEvent = false;
  protected _handleEmptied(event: Event) {
    if (this._ignoreNextEmptiedEvent) return;
    this.dispatchEvent(vdsEvent('vds-emptied', { triggerEvent: event }));
  }

  protected _handleLoadedData(event: Event) {
    this.dispatchEvent(vdsEvent('vds-loaded-data', { triggerEvent: event }));
  }

  protected _handleLoadedMetadata(event: Event) {
    // Sync volume state before metadata.
    this.dispatchEvent(
      vdsEvent('vds-volume-change', {
        detail: {
          volume: this.mediaElement!.volume,
          muted: this.mediaElement!.muted,
        },
      }),
    );

    this.dispatchEvent(
      vdsEvent('vds-loaded-metadata', {
        triggerEvent: event,
        detail: this._getMediaMetadata(),
      }),
    );
  }

  protected _determineMediaType(event: Event) {
    this.dispatchEvent(
      vdsEvent('vds-media-type-change', {
        detail: this._getMediaType(),
        triggerEvent: event,
      }),
    );
  }

  protected _handlePlay(event: Event) {
    const playEvent = vdsEvent('vds-play', { triggerEvent: event });
    playEvent.autoplay = this._attemptingAutoplay;
    this.dispatchEvent(playEvent);
  }

  protected _handlePause(event: Event) {
    // Avoid seeking events triggering pause.
    if (this.mediaElement!.readyState === 1 && !this._isMediaWaiting) {
      return;
    }

    this._isMediaWaiting = false;
    this._cancelTimeUpdates();
    this.dispatchEvent(vdsEvent('vds-pause', { triggerEvent: event }));
  }

  protected _handlePlaying(event: Event) {
    this._isMediaWaiting = false;
    const playingEvent = vdsEvent('vds-playing', { triggerEvent: event });
    this.dispatchEvent(playingEvent);
    this._requestTimeUpdates();
  }

  protected _handleDurationChange(event: Event) {
    if (this.mediaElement!.ended) {
      this._updateCurrentTime(this.mediaElement!.duration, event);
    }

    this.dispatchEvent(
      vdsEvent('vds-duration-change', {
        detail: this.mediaElement!.duration,
        triggerEvent: event,
      }),
    );
  }

  protected _handleProgress(event: Event) {
    this.dispatchEvent(
      vdsEvent('vds-progress', {
        triggerEvent: event,
        detail: {
          buffered: this.mediaElement!.buffered,
          seekable: this.mediaElement!.seekable,
        },
      }),
    );
  }

  protected _handleRateChange(event: Event) {
    // TODO: no-op for now but we'll add playback rate support later.
    throw Error('Not implemented');
  }

  protected _handleSeeking(event: Event) {
    this.dispatchEvent(
      vdsEvent('vds-seeking', {
        detail: this.mediaElement!.currentTime,
        triggerEvent: event,
      }),
    );
  }

  protected _handleSeeked(event: Event) {
    const seekedEvent = vdsEvent('vds-seeked', {
      detail: this.mediaElement!.currentTime,
      triggerEvent: event,
    });

    this.dispatchEvent(seekedEvent);

    const currentTime = this.mediaElement!.currentTime;

    // HLS: If precision has increased by seeking to the end, we'll call `play()` to properly end.
    if (
      Math.trunc(currentTime) === Math.trunc(this.mediaElement!.duration) &&
      getNumberOfDecimalPlaces(this.mediaElement!.duration) > getNumberOfDecimalPlaces(currentTime)
    ) {
      this._updateCurrentTime(this.mediaElement!.duration, event);

      if (!this.mediaElement!.ended) {
        try {
          this.play();
        } catch (e) {
          // no-op
        }
      }
    }
  }

  protected _handleStalled(event: Event) {
    this.dispatchEvent(vdsEvent('vds-stalled', { triggerEvent: event }));

    if (this.mediaElement!.readyState < 3) {
      this._isMediaWaiting = true;
      this.dispatchEvent(vdsEvent('vds-waiting', { triggerEvent: event }));
    }
  }

  protected _handleVolumeChange(event: Event) {
    this.dispatchEvent(
      vdsEvent('vds-volume-change', {
        detail: {
          volume: this.mediaElement!.volume,
          muted: this.mediaElement!.muted,
        },
        triggerEvent: event,
      }),
    );
  }

  protected _handleWaiting(event: Event) {
    if (this.mediaElement!.readyState < 3) {
      this._isMediaWaiting = true;
      this.dispatchEvent(vdsEvent('vds-waiting', { triggerEvent: event }));
    }
  }

  protected _handleSuspend(event: Event) {
    const suspendEvent = vdsEvent('vds-suspend', { triggerEvent: event });
    this.dispatchEvent(suspendEvent);
  }

  protected _handleEnded(event: Event) {
    this._cancelTimeUpdates();

    this._updateCurrentTime(this.mediaElement!.duration, event);

    const endEvent = vdsEvent('vds-end', { triggerEvent: event });
    this.dispatchEvent(endEvent);

    if (this.state.loop) {
      this._handleLoop();
    } else {
      this.dispatchEvent(vdsEvent('vds-ended', { triggerEvent: event }));
    }
  }

  protected _handleLoop() {
    const hasCustomControls = isUndefined(this.mediaElement!.controls);

    // Forcefully hide controls to prevent flashing when looping. Calling `play()` at end
    // of media may show a flash of native controls on iOS, even if `controls` property is not set.
    if (hasCustomControls) {
      this.mediaElement!.controls = false;
    }

    this.dispatchEvent(vdsEvent('vds-loop-request'));
  }

  protected _handleError(event: Event) {
    const mediaError = this.mediaElement!.error;
    if (!mediaError) return;

    this.dispatchEvent(
      vdsEvent('vds-error', {
        detail: {
          message: mediaError.message,
          code: mediaError.code,
          mediaError: mediaError,
        },
        triggerEvent: event,
      }),
    );
  }

  // -------------------------------------------------------------------------------------------
  // Provider Methods
  // -------------------------------------------------------------------------------------------

  protected _getPaused(): boolean {
    return this.mediaElement?.paused ?? true;
  }

  protected _getVolume(): number {
    return this.mediaElement?.volume ?? 1;
  }

  protected _setVolume(newVolume: number) {
    this.mediaElement!.volume = newVolume;
  }

  protected _getCurrentTime(): number {
    return this.mediaElement?.currentTime ?? 0;
  }

  protected _setCurrentTime(newTime: number) {
    if (this.mediaElement!.currentTime !== newTime) {
      this.mediaElement!.currentTime = newTime;
    }
  }

  protected _getMuted() {
    return this.mediaElement?.muted ?? false;
  }

  protected _setMuted(isMuted: boolean) {
    this.mediaElement!.muted = isMuted;
  }

  async play() {
    if (__DEV__) {
      this._logger?.info('attempting to play...');
    }

    try {
      this._throwIfNotReadyForPlayback();
      await this._resetPlaybackIfEnded();
      return this.mediaElement?.play();
    } catch (error) {
      const playErrorEvent = vdsEvent('vds-play-fail');
      playErrorEvent.autoplay = this._attemptingAutoplay;
      playErrorEvent.error = error as Error;
      throw error;
    }
  }

  async pause() {
    if (__DEV__) {
      this._logger?.info('attempting to pause...');
    }

    this._throwIfNotReadyForPlayback();
    return this.mediaElement?.pause();
  }

  protected _getMediaType(): MediaType {
    return getMediaTypeFromExt(this.state.currentSrc);
  }
}
