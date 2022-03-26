import {
  type ArrayElement,
  DisposalBin,
  getNumberOfDecimalPlaces,
  getSlottedChildren,
  isNil,
  isNumber,
  isUndefined,
  keysOf,
  listen,
  observeAttributes,
  vdsEvent,
} from '@vidstack/foundation';
import { type PropertyValues } from 'lit';

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
 * Enables loading, playing and controlling media files via the HTML5 MediaElement API. This is
 * used internally by the `vds-audio` and `vds-video` components. This provider only contains
 * glue code so don't bother using it on it's own.
 */
export class Html5MediaElement extends MediaProviderElement {
  protected _mediaElement?: HTMLMediaElement;

  get mediaElement() {
    return this._mediaElement;
  }

  // -------------------------------------------------------------------------------------------
  // Lifecycle
  // -------------------------------------------------------------------------------------------

  protected override firstUpdated(changedProps: PropertyValues): void {
    super.firstUpdated(changedProps);
    if (this.canLoad) {
      this._attachMediaEventListeners();
    }
  }

  override disconnectedCallback() {
    this._isMediaWaiting = false;
    super.disconnectedCallback();
    this._cancelTimeUpdates();
  }

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

    if (this._currentTime !== newTime) {
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
      const tagName = mediaElement?.tagName.toLowerCase();

      if (tagName && !/(audio|video)/.test(tagName)) {
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

  protected _canMediaElementConnect() {
    return this.canLoad && !isNil(this.mediaElement) && !this._hasMediaElementConnected;
  }

  protected _handleMediaElementConnect() {
    const mediaEl = this.mediaElement!;

    if (!this._canMediaElementConnect()) return;

    this._observeMediaAttributes();
    this._attachMediaEventListeners();
    this._observeMediaSrc();

    if (this.canLoadPoster && mediaEl.hasAttribute('data-poster')) {
      mediaEl.setAttribute('poster', mediaEl.getAttribute('data-poster')!);
    }

    if (!this._willAnotherEngineAttachSrc()) {
      this._startPreloadingMedia();
    }

    // Autoplay already failed
    if (mediaEl.readyState > 2 && mediaEl.autoplay && !this.state.playing) {
      this.dispatchEvent(
        vdsEvent('vds-autoplay-fail', {
          detail: {
            muted: this.state.muted,
            error: Error('Autoplay failed to start playback.'),
          },
        }),
      );
    }

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

  override handleMediaCanLoad() {
    super.handleMediaCanLoad();
    this._handleMediaElementConnect();
  }

  protected _startPreloadingMedia() {
    const mediaEl = this.mediaElement;
    if (mediaEl?.hasAttribute('data-preload')) {
      mediaEl.setAttribute('preload', mediaEl.getAttribute('data-preload') ?? 'metadata');
    }
  }

  protected _observeMediaAttributes() {
    // We should manage these. Media might have already started playback at this point so we can't
    // prevent autoplay, but it ensures we manually handle loops and any future autoplays.
    for (const attrName of ['autoplay', 'loop']) {
      if (this.mediaElement!.hasAttribute(attrName)) {
        this.mediaElement!.removeAttribute(attrName);
        this.mediaElement!.setAttribute(`data-${attrName}`, '');
      }
    }

    const mediaAttrs = ['autoplay', 'poster', 'controls', 'loop', 'playsinline'] as const;
    const mediaDataAttrs = ['autoplay', 'poster', 'loop'].map((attrName) => `data-${attrName}`);
    // Order is important as media attrs have higher priority (should override data attrs).
    const observedAttrs = [...mediaDataAttrs, ...mediaAttrs];

    const observer = observeAttributes(this.mediaElement!, observedAttrs, (attrName, attrValue) => {
      const name = attrName?.replace('data-', '') as ArrayElement<typeof mediaAttrs>;
      const value = name !== 'poster' ? attrValue !== null : attrValue ?? '';
      if (this.state[name] !== value) {
        const changeEventType = `vds-${name}-change` as const;
        this.dispatchEvent(vdsEvent(changeEventType, { detail: value }));
      }
    });

    this._mediaElementDisposal.add(() => observer.disconnect());
  }

  /**
   * Whether the media element can probably play the given media resource based on it's URL.
   */
  canPlaySrc(src: string) {
    const ext = src.split('.').reverse()[0];
    const type = `${getMediaTypeFromExt(src)}/${ext}`;
    return /maybe|probably/i.test(this.mediaElement?.canPlayType(type) ?? '');
  }

  /**
   * Override method to ensure unnecessary src changes don't occur (e.g., blobs).
   */
  protected _ignoreSrcChange(src: string) {
    return this.state.src === src;
  }

  protected _observeMediaSrc() {
    const onSrcChange = () => {
      let src = '';

      // Simple selection algorithm:
      // 1. If `src` is set then use that.
      // 2. If `src` is not set, and there's only one resource then use that.
      // 3. If there's multiple resources, try to find the best suitable.
      // 4. If nothing is found, default is empty string.
      if (!this.mediaElement!.src) {
        const resources = this._getMediaSources();

        if (resources.length === 1) {
          src = resources[0];
        } else {
          // Find first that browser can play.
          for (const resource of resources) {
            /// TODO: prioritize `probably` over `maybe`.
            if (this.canPlaySrc(resource)) {
              src = resource;
              break;
            }
          }
        }
      } else {
        src = this.mediaElement!.src;
      }

      if (this._ignoreSrcChange(src)) return;

      this._isMediaWaiting = false;
      this._handleMediaSrcChange(src);

      if (this.canLoad && !this._willAnotherEngineAttachSrc()) {
        this.mediaElement!.src = src;
        this.mediaElement!.load();
      }
    };

    onSrcChange();
    const observer = new MutationObserver(onSrcChange);
    observer.observe(this.mediaElement!, { attributeFilter: ['src'], subtree: true });
    this._mediaElementDisposal.add(() => observer.disconnect());
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

  protected _handleAbort(event: Event) {
    this.dispatchEvent(vdsEvent('vds-abort', { triggerEvent: event }));
  }

  protected _handleCanPlay(event: Event) {
    if (this.state.canPlay) return;

    if (!this._willAnotherEngineAttachSrc()) {
      this._handleMediaReady({ event, duration: this.mediaElement!.duration });
    }
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
    this.dispatchEvent(
      vdsEvent('vds-load-start', {
        triggerEvent: event,
        detail: this._getMediaMetadata(),
      }),
    );
  }

  protected _getMediaMetadata() {
    return {
      src: this.state.src,
      currentSrc: this.mediaElement!.currentSrc ?? this.mediaElement!.src,
      duration: this.mediaElement!.duration || 0,
      poster: (this.mediaElement as HTMLVideoElement).poster,
      mediaType: this._getMediaType(),
      viewType: this.state.viewType,
    };
  }

  protected _handleEmptied(event: Event) {
    this.dispatchEvent(vdsEvent('vds-emptied', { triggerEvent: event }));
  }

  protected _handleLoadedData(event: Event) {
    this.dispatchEvent(vdsEvent('vds-loaded-data', { triggerEvent: event }));
  }

  /**
   * Can be used to indicate another engine such as `hls.js` will attach to the media element
   * so it can handle certain ready events.
   */
  protected _willAnotherEngineAttachSrc(): boolean {
    return false;
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
    playEvent.autoplay = this._autoplayAttemptPending;
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

  protected _setVolume(newVolume: number) {
    this.mediaElement!.volume = newVolume;
  }

  protected _setCurrentTime(newTime: number) {
    if (this.mediaElement!.currentTime !== newTime) {
      this.mediaElement!.currentTime = newTime;
    }
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
      playErrorEvent.autoplay = this._autoplayAttemptPending;
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
    return getMediaTypeFromExt(this.state.src);
  }
}
