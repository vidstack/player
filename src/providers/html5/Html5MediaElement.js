import { html } from 'lit';
import { createRef } from 'lit/directives/ref.js';

import {
  CanPlay,
  MediaProviderElement,
  VdsAbortEvent,
  VdsCanPlayThroughEvent,
  VdsDurationChangeEvent,
  VdsEmptiedEvent,
  VdsEndedEvent,
  VdsErrorEvent,
  VdsLoadedDataEvent,
  VdsLoadedMetadataEvent,
  VdsLoadStartEvent,
  VdsPauseEvent,
  VdsPlayEvent,
  VdsPlayingEvent,
  VdsProgressEvent,
  VdsReplayEvent,
  VdsSeekedEvent,
  VdsSeekingEvent,
  VdsStalledEvent,
  VdsStartedEvent,
  VdsSuspendEvent,
  VdsTimeUpdateEvent,
  VdsVolumeChangeEvent,
  VdsWaitingEvent
} from '../../media/index.js';
import { listen, redispatchEvent } from '../../shared/events/index.js';
import { getSlottedChildren } from '../../utils/dom.js';
import { IS_SAFARI } from '../../utils/support.js';
import { isNil, isNumber, isUndefined } from '../../utils/unit.js';
import { MediaNetworkState } from './MediaNetworkState.js';
import { MediaReadyState } from './MediaReadyState.js';

/**
 * @typedef {import('./types').Html5MediaProvider} Html5MediaProvider
 */

/**
 * Enables loading, playing and controlling media files via the HTML5 MediaElement API. This is
 * used internally by the `vds-audio` and `vds-video` components. This provider only contains
 * glue code so don't bother using it on it's own.
 *
 * @implements {Html5MediaProvider}
 *
 * @slot Pass `<source>` and `<track>` elements to the underlying HTML5 media player.
 */
export class Html5MediaElement extends MediaProviderElement {
  /** @type {string[]} */
  static get events() {
    return [
      'abort',
      'canplay',
      'canplaythrough',
      'durationchange',
      'emptied',
      'ended',
      'error',
      'loadeddata',
      'loadedmetadata',
      'loadstart',
      'pause',
      'play',
      'playing',
      'progress',
      'ratechange',
      'seeked',
      'seeking',
      'stalled',
      'suspend',
      'timeupdate',
      'volumechange',
      'waiting',
      ...super.events
    ];
  }

  constructor() {
    super();

    // Properties
    /** @type {number | undefined} */
    this.height;
    /** @type {import('./types').MediaControlsList} */
    this.controlsList;
    /** @type {import('./types').MediaCrossOriginOption} */
    this.crossOrigin;
    /** @type {boolean | undefined} */
    this.defaultMuted;
    /** @type {number | undefined} */
    this.defaultPlaybackRate;
    /** @type {boolean | undefined} */
    this.disableRemotePlayback;
    /** @type {import('./types').MediaPreloadOption | undefined} */
    this.preload;
    /** @type {number | undefined} */
    this.width;

    // State
    /** @protected @type {string} */
    this._src = '';
  }

  // -------------------------------------------------------------------------------------------
  // Properties
  // -------------------------------------------------------------------------------------------

  /** @type {import('lit').PropertyDeclarations} */
  static get properties() {
    return {
      // Properties
      height: { type: Number },
      controlsList: {},
      crossOrigin: {},
      defaultMuted: { type: Boolean },
      defaultPlaybackRate: { type: Number },
      disableRemotePlayback: { type: Boolean },
      preload: {},
      src: {},
      width: { type: Number },
      // State
      _src: { state: true }
    };
  }

  /**
   * @protected
   * @readonly
   * @type {import('lit/directives/ref').Ref<HTMLMediaElement>}
   */
  mediaRef = createRef();

  /** @type {HTMLMediaElement} */
  get mediaElement() {
    return /** @type {HTMLMediaElement} */ (this.mediaRef.value);
  }

  get src() {
    return this._src;
  }

  set src(newSrc) {
    if (this._src !== newSrc) {
      this._src = newSrc;
      this.handleMediaSrcChange();
      // No other action requried as the `src` attribute should be updated on the underlying
      // `<audio>` or `<video>` element.
    }
  }

  /**
   * @type {import('./types').MediaSrcObject | undefined}
   */
  get srcObject() {
    return this.mediaElement.srcObject ?? undefined;
  }

  set srcObject(newSrcObject) {
    if (this.mediaElement.srcObject !== newSrcObject) {
      this.mediaElement.srcObject = newSrcObject ?? null;
      if (!this.willAnotherEngineAttach()) this.mediaElement.load();
      this.handleMediaSrcChange();
    }
  }

  /** @type {MediaReadyState} */
  get readyState() {
    return this.mediaElement.readyState;
  }

  /** @type {MediaNetworkState} */
  get networkState() {
    return this.mediaElement.networkState;
  }

  // -------------------------------------------------------------------------------------------
  // Lifecycle
  // -------------------------------------------------------------------------------------------

  /**
   * @param {import('lit').PropertyValues} changedProps
   */
  firstUpdated(changedProps) {
    super.firstUpdated(changedProps);
    this.bindMediaEventListeners();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.cancelTimeUpdates();
  }

  // -------------------------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------------------------

  /**
   * Override this to modify the content rendered inside `<audio>` and `<video>` elements.
   *
   * @protected
   * @returns {import('lit').TemplateResult}
   */
  renderMediaChildren() {
    return html`
      <slot @slotchange="${this.handleDefaultSlotChange}"></slot>
      Your browser does not support the <code>audio</code> or
      <code>video</code> element.
    `;
  }

  // -------------------------------------------------------------------------------------------
  // Time Updates
  // The `timeupdate` event fires surprisingly infrequently during playback, meaning your progress
  // bar (or whatever else is synced to the currentTime) moves in a choppy fashion. This helps
  // resolve that :)
  // -------------------------------------------------------------------------------------------

  /**
   * @protected
   * @type {number}
   */
  timeRAF = -1;

  /**
   * @protected
   */
  cancelTimeUpdates() {
    if (isNumber(this.timeRAF)) window.cancelAnimationFrame(this.timeRAF);
    this.timeRAF = -1;
  }

  /**
   * @protected
   */
  requestTimeUpdates() {
    const newTime = this.mediaElement.currentTime;

    if (this.context.currentTime !== newTime) {
      this.context.currentTime = newTime;
      this.dispatchEvent(new VdsTimeUpdateEvent({ detail: newTime }));
    }

    this.timeRAF = window.requestAnimationFrame(() => {
      if (isUndefined(this.timeRAF)) return;
      this.requestTimeUpdates();
    });
  }

  // -------------------------------------------------------------------------------------------
  // Slots
  // -------------------------------------------------------------------------------------------

  /**
   * @protected
   * @returns {void}
   */
  handleDefaultSlotChange() {
    if (isNil(this.mediaElement)) return;
    this.cancelTimeUpdates();
    this.cleanupOldSourceNodes();
    this.attachNewSourceNodes();
  }

  /**
   * @protected
   * @returns {void}
   */
  cleanupOldSourceNodes() {
    const nodes = this.mediaElement?.querySelectorAll('source,track');
    nodes?.forEach((node) => node.remove());
  }

  /**
   * @protected
   * @returns {void}
   */
  attachNewSourceNodes() {
    const validTags = new Set(['source', 'track']);

    getSlottedChildren(this)
      .filter((node) => validTags.has(node.tagName.toLowerCase()))
      .forEach((node) => this.mediaElement?.appendChild(node.cloneNode()));

    window.requestAnimationFrame(() => {
      this.handleMediaSrcChange();
      if (!this.willAnotherEngineAttach()) this.mediaElement?.load();
    });
  }

  // -------------------------------------------------------------------------------------------
  // Events
  // -------------------------------------------------------------------------------------------

  /**
   * @protected
   * @returns {void}
   */
  bindMediaEventListeners() {
    if (isNil(this.mediaElement)) return;

    const events = {
      abort: this.handleAbort,
      canplay: this.handleCanPlay,
      canplaythrough: this.handleCanPlayThrough,
      durationchange: this.handleDurationChange,
      emptied: this.handleEmptied,
      ended: this.handleEnded,
      error: this.handleError,
      loadeddata: this.handleLoadedData,
      loadedmetadata: this.handleLoadedMetadata,
      loadstart: this.handleLoadStart,
      pause: this.handlePause,
      play: this.handlePlay,
      playing: this.handlePlaying,
      progress: this.handleProgress,
      ratechange: this.handleRateChange,
      seeked: this.handleSeeked,
      seeking: this.handleSeeking,
      stalled: this.handleStalled,
      suspend: this.handleSuspend,
      timeupdate: this.handleTimeUpdate,
      volumechange: this.handleVolumeChange,
      waiting: this.handleWaiting
    };

    Object.keys(events).forEach((type) => {
      const handler = events[type].bind(this);
      this.disconnectDisposal.add(
        listen(this.mediaElement, type, (e) => {
          handler(e);
          // re-dispatch native event for spec-compliance.
          redispatchEvent(this, e);
        })
      );
    });
  }

  /**
   * @protected
   * @param {Event} event
   * @returns {void}
   */
  handleAbort(event) {
    this.dispatchEvent(new VdsAbortEvent({ originalEvent: event }));
  }

  /**
   * @protected
   * @param {Event} event
   * @returns {void}
   */
  handleCanPlay(event) {
    this.context.buffered = this.mediaElement.buffered;
    this.context.seekable = this.mediaElement.seekable;
    if (!this.willAnotherEngineAttach()) this.handleMediaReady(event);
  }

  /**
   * @protected
   * @param {Event} event
   * @returns {void}
   */
  handleCanPlayThrough(event) {
    this.context.canPlayThrough = true;
    this.dispatchEvent(new VdsCanPlayThroughEvent({ originalEvent: event }));
  }

  /**
   * @protected
   * @param {Event} event
   * @returns {void}
   */
  handleLoadStart(event) {
    this.context.currentSrc = this.mediaElement.currentSrc;
    this.dispatchEvent(new VdsLoadStartEvent({ originalEvent: event }));
  }

  /**
   * @protected
   * @param {Event} event
   * @returns {void}
   */
  handleEmptied(event) {
    this.dispatchEvent(new VdsEmptiedEvent({ originalEvent: event }));
  }

  /**
   * @protected
   * @param {Event} event
   * @returns {void}
   */
  handleLoadedData(event) {
    this.dispatchEvent(new VdsLoadedDataEvent({ originalEvent: event }));
  }

  /**
   * Can be used to indicate another engine such as `hls.js` will attach to the media element
   * so it can handle certain ready events.
   *
   * @protected
   * @returns {boolean}
   */
  willAnotherEngineAttach() {
    return false;
  }

  /**
   * @protected
   * @param {Event} event
   * @returns {void}
   */
  handleLoadedMetadata(event) {
    this.context.duration = this.mediaElement.duration;
    this.dispatchEvent(
      new VdsDurationChangeEvent({
        detail: this.context.duration,
        originalEvent: event
      })
    );
    this.dispatchEvent(new VdsLoadedMetadataEvent({ originalEvent: event }));
  }

  /**
   * @protected
   * @param {Event} event
   * @returns {void}
   */
  handlePlay(event) {
    this.requestTimeUpdates();
    this.context.paused = false;
    this.dispatchEvent(new VdsPlayEvent({ originalEvent: event }));
    if (this.context.ended) this.dispatchEvent(new VdsReplayEvent());
    if (!this.context.started) {
      this.context.started = true;
      this.dispatchEvent(new VdsStartedEvent({ originalEvent: event }));
    }
    this.validatePlaybackEndedState();
  }

  /**
   * @protected
   * @param {Event} event
   * @returns {void}
   */
  handlePause(event) {
    this.cancelTimeUpdates();
    this.context.paused = true;
    this.context.playing = false;
    this.context.waiting = false;
    this.dispatchEvent(new VdsPauseEvent({ originalEvent: event }));
  }

  /**
   * @protected
   * @param {Event} event
   * @returns {void}
   */
  handlePlaying(event) {
    this.context.playing = true;
    this.context.waiting = false;
    this.dispatchEvent(new VdsPlayingEvent({ originalEvent: event }));
  }

  /**
   * @protected
   * @param {Event} event
   * @returns {void}
   */
  handleDurationChange(event) {
    this.context.duration = this.mediaElement.duration;
    this.dispatchEvent(
      new VdsDurationChangeEvent({
        detail: this.context.duration,
        originalEvent: event
      })
    );
    this.validatePlaybackEndedState();
  }

  /**
   * @protected
   * @param {Event} event
   * @returns {void}
   */
  handleProgress(event) {
    this.context.buffered = this.mediaElement.buffered;
    this.context.seekable = this.mediaElement.seekable;
    this.dispatchEvent(new VdsProgressEvent({ originalEvent: event }));
  }

  /**
   * @protected
   * @param {Event} event
   * @returns {void}
   */
  handleRateChange(event) {
    // TODO: no-op for now but we'll add playback rate support later.
    throw Error('Not implemented');
  }

  /**
   * @protected
   * @param {Event} event
   * @returns {void}
   */
  handleSeeked(event) {
    this.context.currentTime = this.mediaElement.currentTime;
    this.context.seeking = false;
    this.dispatchEvent(
      new VdsSeekedEvent({
        detail: this.context.currentTime,
        originalEvent: event
      })
    );
    this.validatePlaybackEndedState();
  }

  /**
   * @protected
   * @param {Event} event
   * @returns {void}
   */
  handleSeeking(event) {
    this.context.currentTime = this.mediaElement.currentTime;
    this.context.seeking = true;
    this.dispatchEvent(
      new VdsSeekingEvent({
        detail: this.context.currentTime,
        originalEvent: event
      })
    );
  }

  /**
   * @protected
   * @param {Event} event
   * @returns {void}
   */
  handleStalled(event) {
    this.dispatchEvent(new VdsStalledEvent({ originalEvent: event }));
  }

  /**
   * @protected
   * @param {Event} event
   * @returns {void}
   */
  handleTimeUpdate(event) {
    // -- Time updates are performed in `requestTimeUpdates()`.
    this.context.waiting = false;
    this.validatePlaybackEndedState();
  }

  /**
   * @protected
   * @param {Event} event
   * @returns {void}
   */
  handleVolumeChange(event) {
    this.context.volume = this.mediaElement.volume;
    this.context.muted = this.mediaElement.muted;
    this.dispatchEvent(
      new VdsVolumeChangeEvent({
        detail: {
          volume: this.context.volume,
          muted: this.context.muted
        },
        originalEvent: event
      })
    );
  }

  /**
   * @protected
   * @param {Event} event
   * @returns {void}
   */
  handleWaiting(event) {
    this.context.waiting = true;
    this.dispatchEvent(new VdsWaitingEvent({ originalEvent: event }));
  }

  /**
   * @protected
   * @param {Event} event
   * @returns {void}
   */
  handleSuspend(event) {
    this.context.waiting = false;
    this.dispatchEvent(new VdsSuspendEvent({ originalEvent: event }));
  }

  /**
   * @protected
   * @param {Event} event
   * @returns {void}
   */
  handleEnded(event) {
    // Check becuase might've been handled in `validatePlaybackEnded()`.
    if (!this.context.ended && !this.loop) {
      this.context.ended = true;
      this.context.waiting = false;
      this.dispatchEvent(new VdsEndedEvent({ originalEvent: event }));
      this.cancelTimeUpdates();
    } else if (this.loop) {
      this.dispatchEvent(new VdsReplayEvent({ originalEvent: event }));
    }
  }

  /**
   * @protected
   * @param {Event} event
   * @returns {void}
   */
  handleError(event) {
    this.context.error = this.mediaElement.error;
    this.dispatchEvent(
      new VdsErrorEvent({
        detail: this.mediaElement.error,
        originalEvent: event
      })
    );
  }

  // -------------------------------------------------------------------------------------------
  // Provider Methods
  // -------------------------------------------------------------------------------------------

  /**
   * @protected
   * @returns {boolean}
   */
  getPaused() {
    return this.mediaElement.paused;
  }

  /**
   * @protected
   * @returns {number}
   */
  getVolume() {
    return this.mediaElement.volume;
  }

  /**
   * @protected
   * @param {number} newVolume
   * @returns {void}
   */
  setVolume(newVolume) {
    this.mediaElement.volume = newVolume;
  }

  /**
   * @protected
   * @returns {number}
   */
  getCurrentTime() {
    return this.mediaElement.currentTime;
  }

  /**
   * @protected
   * @param {number} newTime
   * @returns {void}
   */
  setCurrentTime(newTime) {
    if (this.mediaElement.currentTime !== newTime) {
      this.mediaElement.currentTime = newTime;
      // Doesn't fire `seeked` near end.
      if (IS_SAFARI) this.validatePlaybackEndedState();
    }
  }

  /**
   * @protected
   * @returns {boolean}
   */
  getMuted() {
    return this.mediaElement.muted;
  }

  /**
   * @protected
   * @param {boolean} isMuted
   * @returns {void}
   */
  setMuted(isMuted) {
    this.mediaElement.muted = isMuted;
  }

  // -------------------------------------------------------------------------------------------
  // Readonly Properties
  // -------------------------------------------------------------------------------------------

  get engine() {
    return this.mediaElement;
  }

  get buffered() {
    if (isNil(this.mediaElement)) return new TimeRanges();
    return this.mediaElement.buffered;
  }

  get error() {
    return this.mediaElement?.error ?? undefined;
  }

  // -------------------------------------------------------------------------------------------
  // Methods
  // -------------------------------------------------------------------------------------------

  /**
   * @param {string} type
   * @returns {CanPlay}
   */
  canPlayType(type) {
    if (isNil(this.mediaElement)) {
      return CanPlay.No;
    }

    return this.mediaElement.canPlayType(type);
  }

  async play() {
    this.throwIfNotReadyForPlayback();
    if (this.context.ended) this.dispatchEvent(new VdsReplayEvent());
    await this.resetPlaybackIfEnded();
    return this.mediaElement.play();
  }

  async pause() {
    this.throwIfNotReadyForPlayback();
    return this.mediaElement.pause();
  }

  captureStream() {
    this.throwIfNotReadyForPlayback();
    return this.mediaElement.captureStream?.();
  }

  load() {
    this.mediaElement?.load();
  }
}
