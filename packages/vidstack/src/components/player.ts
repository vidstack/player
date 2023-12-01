import {
  Component,
  computed,
  effect,
  getScope,
  method,
  onDispose,
  peek,
  prop,
  provideContext,
  scoped,
  signal,
} from 'maverick.js';
import type { ElementAttributesRecord } from 'maverick.js/element';
import {
  animationFrameThrottle,
  camelToKebabCase,
  listenEvent,
  setAttribute,
  setStyle,
  uppercaseFirstChar,
} from 'maverick.js/std';

import {
  AudioTrackList,
  isTrackCaptionKind,
  MediaControls,
  MediaRemoteControl,
  mediaState,
  PlayerQueryList,
  TextRenderers,
  TextTrackList,
  VideoQualityList,
  type FindMediaPlayerEvent,
  type MediaFullscreenRequestTarget,
  type MediaPlayerConnectEvent,
  type MediaPlayerEvents,
  type MediaPlayerProps,
  type MediaPlayerState,
  type MediaStateAccessors,
  type MediaStore,
} from '../core';
import { MEDIA_ATTRIBUTES, mediaAttributes } from '../core/api/media-attrs';
import { mediaContext, type MediaContext } from '../core/api/media-context';
import { mediaPlayerProps } from '../core/api/player-props';
import { MediaKeyboardController } from '../core/keyboard/controller';
import { MediaEventsLogger } from '../core/state/media-events-logger';
import { MediaLoadController } from '../core/state/media-load-controller';
import { MediaPlayerDelegate } from '../core/state/media-player-delegate';
import { MediaRequestContext, MediaRequestManager } from '../core/state/media-request-manager';
import { MediaStateManager } from '../core/state/media-state-manager';
import { MediaStateSync } from '../core/state/media-state-sync';
import { TextTrackSymbol } from '../core/tracks/text/symbols';
import { canFullscreen } from '../foundation/fullscreen/controller';
import { Logger } from '../foundation/logger/controller';
import { LogPrinter } from '../foundation/logger/log-printer';
import { FocusVisibleController } from '../foundation/observers/focus-visible';
import { ScreenOrientationController } from '../foundation/orientation/controller';
import { RequestQueue } from '../foundation/queue/request-queue';
import type { AnyMediaProvider, MediaProviderAdapter } from '../providers';
import { setAttributeIfEmpty } from '../utils/dom';
import { clampNumber } from '../utils/number';
import { canChangeVolume, IS_IPHONE } from '../utils/support';

declare global {
  interface HTMLElementEventMap {
    'media-player-connect': MediaPlayerConnectEvent;
    'find-media-player': FindMediaPlayerEvent;
  }
}

/**
 * All media elements exist inside the `<media-player>` component. This component's main
 * responsibilities are to manage media state updates, dispatch media events, handle media
 * requests, and expose media state through HTML attributes and CSS properties for styling
 * purposes.
 *
 * @attr data-autoplay - Autoplay has successfully started.
 * @attr data-autoplay-error - Autoplay has failed to start.
 * @attr data-buffering - Media is not ready for playback or waiting for more data.
 * @attr data-can-fullscreen - Fullscreen mode is available.
 * @attr data-can-load - Media can now begin loading.
 * @attr data-can-pip - Picture-in-Picture mode is available.
 * @attr data-can-play - Media is ready for playback.
 * @attr data-can-seek - Seeking operations are permitted.
 * @attr data-captions - Captions are available and visible.
 * @attr data-controls - Controls are visible.
 * @attr data-ended - Playback has ended.
 * @attr data-error - Issue with media loading/playback.
 * @attr data-fullscreen - Fullscreen mode is active.
 * @attr data-ios-controls - iOS controls are visible.
 * @attr data-live - Media is live stream.
 * @attr data-live-edge - Playback is at the live edge.
 * @attr data-loop - Media is set to replay on end.
 * @attr data-media-type - Current media type (audio/video).
 * @attr data-muted - Whether volume is muted (0).
 * @attr data-orientation - Current screen orientation (landscape/portrait).
 * @attr data-paused - Whether playback is paused.
 * @attr data-pip - Picture-in-picture mode is active.
 * @attr data-playing - Playback is active.
 * @attr data-playsinline - Media should play inline by default (iOS).
 * @attr data-pointer - The user's pointer device type (coarse/fine).
 * @attr data-preview - The user is interacting with the time slider.
 * @attr data-seeking - User is seeking to a new playback position.
 * @attr data-started - Media playback has started.
 * @attr data-stream-type - Current stream type.
 * @attr data-view-type - Current view type (audio/video).
 * @attr data-waiting - Media is waiting for more data to resume playback.
 * @attr data-focus - Whether player is being keyboard focused.
 * @attr data-hocus - Whether player is being keyboard focused or hovered over.
 * @docs {@link https://www.vidstack.io/docs/player/components/media/player}
 */
export class MediaPlayer
  extends Component<MediaPlayerProps, MediaPlayerState, MediaPlayerEvents>
  implements MediaStateAccessors
{
  static props: MediaPlayerProps = mediaPlayerProps;
  static state = mediaState;

  private _media: MediaContext;
  private _stateMgr: MediaStateManager;
  private _requestMgr: MediaRequestManager;

  @prop
  readonly canPlayQueue = new RequestQueue();

  private get _provider() {
    return this._media.$provider() as AnyMediaProvider | null;
  }

  constructor() {
    super();

    new MediaStateSync();

    const context = {
      player: this,
      scope: getScope(),
      qualities: new VideoQualityList(),
      audioTracks: new AudioTrackList(),
      $provider: signal<MediaProvider | null>(null),
      $props: this.$props,
      $state: this.$state as MediaStore,
    } as unknown as MediaContext;

    if (__DEV__) {
      const logPrinter = new LogPrinter();
      effect(() => {
        logPrinter.logLevel = this.$props.logLevel();
      });
    }

    if (__DEV__) context.logger = new Logger();
    context.remote = new MediaRemoteControl(__DEV__ ? context.logger : undefined);
    context.remote.setPlayer(this);
    context.$iosControls = computed(this._isIOSControls.bind(this));
    context.textTracks = new TextTrackList();
    context.textTracks[TextTrackSymbol._crossorigin] = this.$state.crossorigin;
    context.textRenderers = new TextRenderers(context);
    context.ariaKeys = {};

    this._media = context;
    provideContext(mediaContext, context);

    this.orientation = new ScreenOrientationController();

    new FocusVisibleController();
    new MediaKeyboardController(context);
    if (__DEV__) new MediaEventsLogger(context);

    const request = new MediaRequestContext();
    this._stateMgr = new MediaStateManager(request, context);
    this._requestMgr = new MediaRequestManager(this._stateMgr, request, context);

    context.delegate = new MediaPlayerDelegate(
      this._stateMgr._handle.bind(this._stateMgr),
      context,
    );

    new MediaLoadController(this.startLoading.bind(this));
  }

  protected override onSetup(): void {
    this._setupMediaAttributes();
    effect(this._watchCanPlay.bind(this));
    effect(this._watchMuted.bind(this));
    effect(this._watchPaused.bind(this));
    effect(this._watchVolume.bind(this));
    effect(this._watchCurrentTime.bind(this));
    effect(this._watchPlaysinline.bind(this));
    effect(this._watchPlaybackRate.bind(this));
  }

  protected override onAttach(el: HTMLElement): void {
    el.setAttribute('data-media-player', '');
    setAttributeIfEmpty(el, 'tabindex', '0');
    setAttributeIfEmpty(el, 'role', 'region');

    if (__SERVER__) this._watchTitle();
    else effect(this._watchTitle.bind(this));

    if (__SERVER__) this._watchOrientation();
    else effect(this._watchOrientation.bind(this));

    listenEvent(el, 'find-media-player', this._onFindPlayer.bind(this));
  }

  protected override onConnect(el: HTMLElement) {
    if (IS_IPHONE) setAttribute(el, 'data-iphone', '');

    canChangeVolume().then(this.$state.canSetVolume.set);

    const pointerQuery = window.matchMedia('(pointer: coarse)');
    this._onPointerChange(pointerQuery);
    pointerQuery.onchange = this._onPointerChange.bind(this);

    const resize = new ResizeObserver(animationFrameThrottle(this._onResize.bind(this)));
    resize.observe(el);

    effect(this._onResize.bind(this));

    this.dispatch('media-player-connect', {
      detail: this,
      bubbles: true,
      composed: true,
    });

    if (__DEV__) this._media.logger!.setTarget(el);

    onDispose(() => {
      resize.disconnect();
      pointerQuery.onchange = null;
      if (__DEV__) this._media.logger!.setTarget(null);
    });
  }

  protected override onDestroy(): void {
    // @ts-expect-error
    this._media.player = null;
    this.canPlayQueue._reset();
  }

  private _skipTitleUpdate = false;
  private _watchTitle() {
    if (this._skipTitleUpdate) {
      this._skipTitleUpdate = false;
      return;
    }

    const { title, live, viewType } = this.$state,
      isLive = live(),
      type = uppercaseFirstChar(viewType()),
      typeText = type !== 'Unknown' ? `${isLive ? 'Live ' : ''}${type}` : isLive ? 'Live' : 'Media';

    const currentTitle = title();

    setAttribute(
      this.el!,
      'aria-label',
      currentTitle ? `${typeText} - ${currentTitle}` : typeText + ' Player',
    );

    // Title attribute is removed to prevent popover interfering with user hovering over player.
    if (!__SERVER__ && this.el && customElements.get(this.el.localName)) {
      this._skipTitleUpdate = true;
    }

    this.el?.removeAttribute('title');
  }

  private _watchOrientation() {
    const orientation = this.orientation.landscape ? 'landscape' : 'portrait';
    this.$state.orientation.set(orientation);
    setAttribute(this.el!, 'data-orientation', orientation);
    this._onResize();
  }

  private _watchCanPlay() {
    if (this.$state.canPlay() && this._provider) this.canPlayQueue._start();
    else this.canPlayQueue._stop();
  }

  private _setupMediaAttributes() {
    if (MediaPlayer[MEDIA_ATTRIBUTES]) {
      this.setAttributes(MediaPlayer[MEDIA_ATTRIBUTES]);
      return;
    }

    const $attrs: ElementAttributesRecord = {
      'data-captions': function (this: MediaPlayer) {
        const track = this.$state.textTrack();
        return !!track && isTrackCaptionKind(track);
      },
      'data-ios-controls': function (this: MediaPlayer) {
        return this._media.$iosControls();
      },
      'data-controls': function (this: MediaPlayer) {
        return this.controls.showing;
      },
      'data-buffering': function (this: MediaPlayer) {
        const { canPlay, waiting } = this.$state;
        return !canPlay() || waiting();
      },
      'data-error': function (this: MediaPlayer) {
        const { error } = this.$state;
        return !!error();
      },
      'data-autoplay-error': function (this: MediaPlayer) {
        const { autoplayError } = this.$state;
        return !!autoplayError();
      },
    };

    const alias = {
      canPictureInPicture: 'can-pip',
      pictureInPicture: 'pip',
    };

    for (const prop of mediaAttributes) {
      const attrName = 'data-' + (alias[prop] ?? camelToKebabCase(prop));
      $attrs[attrName] = function (this: MediaPlayer) {
        return this.$state[prop]() as string | number;
      };
    }

    delete $attrs.title;
    MediaPlayer[MEDIA_ATTRIBUTES] = $attrs;
    this.setAttributes($attrs);
  }

  private _onFindPlayer(event: FindMediaPlayerEvent) {
    event.detail(this);
  }

  private _onResize() {
    if (__SERVER__ || !this.el) return;

    const width = this.el.clientWidth,
      height = this.el.clientHeight;

    this.$state.width.set(width);
    this.$state.height.set(height);

    setStyle(this.el, '--player-width', width + 'px');
    setStyle(this.el, '--player-height', height + 'px');
  }

  private _onPointerChange(queryList: MediaQueryList | MediaQueryListEvent) {
    if (__SERVER__) return;
    const pointer = queryList.matches ? 'coarse' : 'fine';
    setAttribute(this.el!, 'data-pointer', pointer);
    this.$state.pointer.set(pointer);
    this._onResize();
  }

  private _isIOSControls() {
    const { playsinline, fullscreen } = this.$state;
    return (
      IS_IPHONE &&
      !canFullscreen() &&
      this.$state.mediaType() === 'video' &&
      (!playsinline() || fullscreen())
    );
  }

  /**
   * The current media provider.
   */
  @prop
  get provider(): AnyMediaProvider | null {
    return this._provider;
  }

  /**
   * Media controls settings.
   */
  @prop
  get controls(): MediaControls {
    return this._requestMgr._controls;
  }

  /**
   * Controls the screen orientation of the current browser window and dispatches orientation
   * change events on the player.
   */
  @prop
  readonly orientation: ScreenOrientationController;

  /**
   * The title of the current media.
   */
  @prop
  get title() {
    return peek(this.$state.providedTitle);
  }

  set title(newTitle) {
    if (this._skipTitleUpdate) return;
    this.$state.providedTitle.set(newTitle);
  }

  /**
   * A list of all `VideoQuality` objects representing the set of available video renditions.
   *
   * @see {@link https://vidstack.io/docs/player/core-concepts/quality#quality-list}
   */
  @prop
  get qualities(): VideoQualityList {
    return this._media.qualities;
  }

  /**
   * A list of all `AudioTrack` objects representing the set of available audio tracks.
   *
   * @see {@link https://vidstack.io/docs/player/core-concepts/audio-tracks}
   */
  @prop
  get audioTracks(): AudioTrackList {
    return this._media.audioTracks;
  }

  /**
   * A list of all `TextTrack` objects representing the set of available text tracks.
   *
   * @see {@link https://vidstack.io/docs/player/core-concepts/text-tracks}
   */
  @prop
  get textTracks(): TextTrackList {
    return this._media.textTracks;
  }

  /**
   * Contains text renderers which are responsible for loading, parsing, and rendering text
   * tracks.
   *
   * @see {@link https://vidstack.io/docs/player/core-concepts/text-tracks#text-renderer}
   */
  @prop
  get textRenderers(): TextRenderers {
    return this._media.textRenderers;
  }

  @prop
  get paused() {
    return peek(this.$state.paused);
  }

  set paused(paused) {
    this._queuePausedUpdate(paused);
  }

  private _watchPaused() {
    this._queuePausedUpdate(this.$props.paused());
  }

  private _queuePausedUpdate(paused: boolean) {
    if (paused) {
      this.canPlayQueue._enqueue('paused', () => this._requestMgr._pause());
    } else this.canPlayQueue._enqueue('paused', () => this._requestMgr._play());
  }

  @prop
  get muted() {
    return peek(this.$state.muted);
  }

  set muted(muted) {
    this._queueMutedUpdate(muted);
  }

  private _watchMuted() {
    this._queueMutedUpdate(this.$props.muted());
  }

  private _queueMutedUpdate(muted: boolean) {
    this.canPlayQueue._enqueue('muted', () => {
      if (this._provider) this._provider.setMuted(muted);
    });
  }

  @prop
  get currentTime() {
    return peek(this.$state.currentTime);
  }

  set currentTime(time) {
    this._queueCurrentTimeUpdate(time);
  }

  private _watchCurrentTime() {
    this._queueCurrentTimeUpdate(this.$props.currentTime());
  }

  private _queueCurrentTimeUpdate(time: number) {
    this.canPlayQueue._enqueue('currentTime', () => {
      if (time === peek(this.$state.currentTime)) return;
      peek(() => {
        if (!this._provider) return;

        const boundTime = Math.min(
          Math.max(this.$state.seekableStart() + 0.1, time),
          this.$state.seekableEnd() - 0.1,
        );

        if (Number.isFinite(boundTime)) this._provider.setCurrentTime(boundTime);
      });
    });
  }

  @prop
  get volume() {
    return peek(this.$state.volume);
  }

  set volume(volume) {
    this._queueVolumeUpdate(volume);
  }

  private _watchVolume() {
    this._queueVolumeUpdate(this.$props.volume());
  }

  private _queueVolumeUpdate(volume: number) {
    const clampedVolume = clampNumber(0, volume, 1);
    this.canPlayQueue._enqueue('volume', () => {
      if (this._provider) this._provider.setVolume(clampedVolume);
    });
  }

  @prop
  get playbackRate() {
    return peek(this.$state.playbackRate);
  }

  set playbackRate(rate) {
    this._queuePlaybackRateUpdate(rate);
  }

  private _watchPlaybackRate() {
    this._queuePlaybackRateUpdate(this.$props.playbackRate());
  }

  private _queuePlaybackRateUpdate(rate: number) {
    this.canPlayQueue._enqueue('rate', () => {
      if (this._provider) this._provider.setPlaybackRate?.(rate);
    });
  }

  private _watchPlaysinline() {
    this._queuePlaysinlineUpdate(this.$props.playsinline());
  }

  private _queuePlaysinlineUpdate(inline: boolean) {
    this.canPlayQueue._enqueue('playsinline', () => {
      if (this._provider) (this._provider as MediaProviderAdapter).setPlaysinline?.(inline);
    });
  }

  /**
   * Begins/resumes playback of the media. If this method is called programmatically before the
   * user has interacted with the player, the promise may be rejected subject to the browser's
   * autoplay policies. This method will throw if called before media is ready for playback.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play}
   */
  @method
  async play(trigger?: Event) {
    return this._requestMgr._play(trigger);
  }

  /**
   * Pauses playback of the media. This method will throw if called before media is ready for
   * playback.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause}
   */
  @method
  async pause(trigger?: Event) {
    return this._requestMgr._pause(trigger);
  }

  /**
   * Attempts to display the player in fullscreen. The promise will resolve if successful, and
   * reject if not. This method will throw if any fullscreen API is _not_ currently available.
   *
   * @see {@link https://vidstack.io/docs/player/core-concepts/fullscreen}
   */
  @method
  async enterFullscreen(target?: MediaFullscreenRequestTarget, trigger?: Event) {
    return this._requestMgr._enterFullscreen(target, trigger);
  }

  /**
   * Attempts to display the player inline by exiting fullscreen. This method will throw if any
   * fullscreen API is _not_ currently available.
   *
   * @see {@link https://vidstack.io/docs/player/core-concepts/fullscreen}
   */
  @method
  async exitFullscreen(target?: MediaFullscreenRequestTarget, trigger?: Event) {
    return this._requestMgr._exitFullscreen(target, trigger);
  }

  /**
   * Attempts to display the player in picture-in-picture mode. This method will throw if PIP is
   * not supported. This method will also return a `PictureInPictureWindow` if the current
   * provider supports it.
   *
   * @see {@link https://vidstack.io/docs/player/core-concepts/picture-in-picture}
   */
  @method
  enterPictureInPicture(trigger?: Event) {
    return this._requestMgr._enterPictureInPicture(trigger);
  }

  /**
   * Attempts to display the player in inline by exiting picture-in-picture mode. This method
   * will throw if not supported.
   *
   * @see {@link https://vidstack.io/docs/player/core-concepts/picture-in-picture}
   */
  @method
  exitPictureInPicture(trigger?: Event) {
    return this._requestMgr._exitPictureInPicture(trigger);
  }

  /**
   * Sets the current time to the live edge (i.e., `duration`). This is a no-op for non-live
   * streams and will throw if called before media is ready for playback.
   *
   * @see {@link https://vidstack.io/docs/player/core-concepts/live#live-edge}
   */
  @method
  seekToLiveEdge(trigger?: Event): void {
    this._requestMgr._seekToLiveEdge(trigger);
  }

  /**
   * Called when media can begin loading. Calling this method will trigger the initial provider
   * loading process. Calling it more than once has no effect.
   *
   * @see {@link https://vidstack.io/docs/player/core-concepts/loading#loading-strategies}
   */
  @method
  startLoading(trigger?: Event): void {
    this._media.delegate._notify('can-load', undefined, trigger);
  }

  /**
   * Returns a new `PlayerQueryList` object that can then be used to determine if the
   * player and document matches the query string, as well as to monitor any changes to detect
   * when it matches (or stops matching) that query.
   *
   * A player query supports the same syntax as media queries and allows media state properties
   * to be used like so:
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryList}
   * @example
   * ```ts
   * const queryList = player.matchQuery("(width < 680) and (streamType: on-demand)");
   *
   * if (queryList.matches) {
   *  // ...
   * }
   *
   * // Listen for match changes.
   * queryList.addEventListener("change", () => {
   *   // ...
   * });
   * ```
   */
  @method
  matchQuery(query: string) {
    return scoped(() => PlayerQueryList.create(query), this.scope)!;
  }

  override destroy() {
    this._media.remote.setPlayer(null);
    this.dispatch('destroy');
  }
}
