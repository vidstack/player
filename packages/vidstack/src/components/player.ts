import {
  Component,
  computed,
  effect,
  method,
  onDispose,
  peek,
  prop,
  provideContext,
  signal,
  type WriteSignalRecord,
} from 'maverick.js';
import type { ElementAttributesRecord } from 'maverick.js/element';
import {
  animationFrameThrottle,
  camelToKebabCase,
  isString,
  listenEvent,
  setAttribute,
  setStyle,
  uppercaseFirstChar,
} from 'maverick.js/std';

import { MEDIA_ATTRIBUTES, mediaAttributes } from '../core/api/media-attrs';
import { mediaContext, type MediaContext } from '../core/api/media-context';
import type { MediaFullscreenRequestTarget } from '../core/api/media-request-events';
import type {
  FindMediaPlayerEvent,
  MediaPlayerConnectEvent,
  MediaPlayerEvents,
} from '../core/api/player-events';
import {
  mediaPlayerProps,
  type MediaPlayerProps,
  type MediaStateAccessors,
} from '../core/api/player-props';
import { mediaState, type MediaPlayerState, type MediaStore } from '../core/api/player-state';
import type { MediaControls } from '../core/controls';
import { MediaKeyboardController } from '../core/keyboard/controller';
import { VideoQualityList } from '../core/quality/video-quality';
import { MediaEventsLogger } from '../core/state/media-events-logger';
import { MediaLoadController } from '../core/state/media-load-controller';
import { MediaPlayerDelegate } from '../core/state/media-player-delegate';
import { MediaRequestContext, MediaRequestManager } from '../core/state/media-request-manager';
import { MediaStateManager } from '../core/state/media-state-manager';
import { MediaStateSync } from '../core/state/media-state-sync';
import { LocalMediaStorage, type MediaStorage } from '../core/state/media-storage';
import { NavigatorMediaSession } from '../core/state/navigator-media-session';
import { MediaRemoteControl } from '../core/state/remote-control';
import { AudioTrackList } from '../core/tracks/audio-tracks';
import { TextRenderers } from '../core/tracks/text/render/text-renderer';
import { TextTrackSymbol } from '../core/tracks/text/symbols';
import { isTrackCaptionKind } from '../core/tracks/text/text-track';
import { TextTrackList } from '../core/tracks/text/text-tracks';
import { Logger } from '../foundation/logger/controller';
import { LogPrinter } from '../foundation/logger/log-printer';
import { FocusVisibleController } from '../foundation/observers/focus-visible';
import { ScreenOrientationController } from '../foundation/orientation/controller';
import { RequestQueue } from '../foundation/queue/request-queue';
import type { AnyMediaProvider, MediaProviderAdapter } from '../providers/types';
import { setAttributeIfEmpty } from '../utils/dom';
import { clampNumber } from '../utils/number';
import { IS_IPHONE } from '../utils/support';

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
 * @attr data-airplay - Whether AirPlay is connected.
 * @attr data-autoplay - Autoplay has successfully started.
 * @attr data-autoplay-error - Autoplay has failed to start.
 * @attr data-buffering - Media is not ready for playback or waiting for more data.
 * @attr data-can-airplay - Whether AirPlay is available.
 * @attr data-can-fullscreen - Fullscreen mode is available.
 * @attr data-can-google-cast - Whether Google Cast is available.
 * @attr data-can-load - Media can now begin loading.
 * @attr data-can-pip - Picture-in-Picture mode is available.
 * @attr data-can-play - Media is ready for playback.
 * @attr data-can-seek - Seeking operations are permitted.
 * @attr data-captions - Captions are available and visible.
 * @attr data-controls - Controls are visible.
 * @attr data-ended - Playback has ended.
 * @attr data-error - Issue with media loading/playback.
 * @attr data-fullscreen - Fullscreen mode is active.
 * @attr data-google-cast - Whether Google Cast is connected.
 * @attr data-ios-controls - iOS controls are visible.
 * @attr data-load - Specified load strategy.
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
 * @attr data-remote-type - The remote playback type (airplay/google-cast).
 * @attr data-remote-state - The remote playback state (connecting/connected/disconnected).
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

  readonly #media: MediaContext;
  readonly #stateMgr: MediaStateManager;
  readonly #requestMgr: MediaRequestManager;

  @prop
  readonly canPlayQueue = new RequestQueue();

  @prop
  readonly remoteControl: MediaRemoteControl;

  get #provider() {
    return this.#media.$provider() as AnyMediaProvider | null;
  }

  get #props() {
    return this.$props as unknown as WriteSignalRecord<MediaPlayerProps>;
  }

  constructor() {
    super();

    new MediaStateSync();

    const context = {
      player: this,
      qualities: new VideoQualityList(),
      audioTracks: new AudioTrackList(),
      storage: null,
      $provider: signal<MediaProvider | null>(null),
      $providerSetup: signal(false),
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
    context.remote = this.remoteControl = new MediaRemoteControl(
      __DEV__ ? context.logger : undefined,
    );
    context.remote.setPlayer(this);
    context.textTracks = new TextTrackList();
    context.textTracks[TextTrackSymbol.crossOrigin] = this.$state.crossOrigin;
    context.textRenderers = new TextRenderers(context);
    context.ariaKeys = {};

    this.#media = context;
    provideContext(mediaContext, context);

    this.orientation = new ScreenOrientationController();

    new FocusVisibleController();
    new MediaKeyboardController(context);
    if (__DEV__) new MediaEventsLogger(context);

    const request = new MediaRequestContext();
    this.#stateMgr = new MediaStateManager(request, context);
    this.#requestMgr = new MediaRequestManager(this.#stateMgr, request, context);

    context.delegate = new MediaPlayerDelegate(this.#stateMgr.handle.bind(this.#stateMgr), context);

    context.notify = context.delegate.notify.bind(context.delegate);

    if (typeof navigator !== 'undefined' && 'mediaSession' in navigator) {
      new NavigatorMediaSession();
    }

    new MediaLoadController('load', this.startLoading.bind(this));
    new MediaLoadController('posterLoad', this.startLoadingPoster.bind(this));
  }

  protected override onSetup(): void {
    this.#setupMediaAttributes();
    effect(this.#watchCanPlay.bind(this));
    effect(this.#watchMuted.bind(this));
    effect(this.#watchPaused.bind(this));
    effect(this.#watchVolume.bind(this));
    effect(this.#watchCurrentTime.bind(this));
    effect(this.#watchPlaysInline.bind(this));
    effect(this.#watchPlaybackRate.bind(this));
  }

  protected override onAttach(el: HTMLElement): void {
    el.setAttribute('data-media-player', '');
    setAttributeIfEmpty(el, 'tabindex', '0');
    setAttributeIfEmpty(el, 'role', 'region');

    effect(this.#watchStorage.bind(this));

    if (__SERVER__) this.#watchTitle();
    else effect(this.#watchTitle.bind(this));

    if (__SERVER__) this.#watchOrientation();
    else effect(this.#watchOrientation.bind(this));

    listenEvent(el, 'find-media-player', this.#onFindPlayer.bind(this));
  }

  protected override onConnect(el: HTMLElement) {
    if (IS_IPHONE) setAttribute(el, 'data-iphone', '');

    const pointerQuery = window.matchMedia('(pointer: coarse)');
    this.#onPointerChange(pointerQuery);
    pointerQuery.onchange = this.#onPointerChange.bind(this);

    const resize = new ResizeObserver(animationFrameThrottle(this.#onResize.bind(this)));
    resize.observe(el);

    effect(this.#onResize.bind(this));

    this.dispatch('media-player-connect', {
      detail: this,
      bubbles: true,
      composed: true,
    });

    if (__DEV__) this.#media.logger!.setTarget(el);

    onDispose(() => {
      resize.disconnect();
      pointerQuery.onchange = null;
      if (__DEV__) this.#media.logger!.setTarget(null);
    });
  }

  protected override onDestroy(): void {
    // @ts-expect-error
    this.#media.player = null;
    this.canPlayQueue.reset();
  }

  #skipTitleUpdate = false;
  #watchTitle() {
    const el = this.$el,
      { title, live, viewType, providedTitle } = this.$state,
      isLive = live(),
      type = uppercaseFirstChar(viewType()),
      typeText = type !== 'Unknown' ? `${isLive ? 'Live ' : ''}${type}` : isLive ? 'Live' : 'Media',
      currentTitle = title();

    setAttribute(
      this.el!,
      'aria-label',
      `${typeText} Player` + (currentTitle ? ` - ${currentTitle}` : ''),
    );

    // Title attribute is removed to prevent popover interfering with user hovering over player.
    if (!__SERVER__ && el?.hasAttribute('title')) {
      this.#skipTitleUpdate = true;
      el?.removeAttribute('title');
    }
  }

  #watchOrientation() {
    const orientation = this.orientation.landscape ? 'landscape' : 'portrait';
    this.$state.orientation.set(orientation);
    setAttribute(this.el!, 'data-orientation', orientation);
    this.#onResize();
  }

  #watchCanPlay() {
    if (this.$state.canPlay() && this.#provider) this.canPlayQueue.start();
    else this.canPlayQueue.stop();
  }

  #setupMediaAttributes() {
    if (MediaPlayer[MEDIA_ATTRIBUTES]) {
      this.setAttributes(MediaPlayer[MEDIA_ATTRIBUTES]);
      return;
    }

    const $attrs: ElementAttributesRecord = {
      'data-load': function (this: MediaPlayer) {
        return this.$props.load();
      },
      'data-captions': function (this: MediaPlayer) {
        const track = this.$state.textTrack();
        return !!track && isTrackCaptionKind(track);
      },
      'data-ios-controls': function (this: MediaPlayer) {
        return this.$state.iOSControls();
      },
      'data-controls': function (this: MediaPlayer) {
        return this.controls.showing;
      },
      'data-buffering': function (this: MediaPlayer) {
        const { canLoad, canPlay, waiting } = this.$state;
        return canLoad() && (!canPlay() || waiting());
      },
      'data-error': function (this: MediaPlayer) {
        const { error } = this.$state;
        return !!error();
      },
      'data-autoplay-error': function (this: MediaPlayer) {
        const { autoPlayError } = this.$state;
        return !!autoPlayError();
      },
    };

    const alias: Partial<Record<keyof MediaPlayerState, string>> = {
      autoPlay: 'autoplay',
      canAirPlay: 'can-airplay',
      canPictureInPicture: 'can-pip',
      pictureInPicture: 'pip',
      playsInline: 'playsinline',
      remotePlaybackState: 'remote-state',
      remotePlaybackType: 'remote-type',
      isAirPlayConnected: 'airplay',
      isGoogleCastConnected: 'google-cast',
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

  #onFindPlayer(event: FindMediaPlayerEvent) {
    event.detail(this);
  }

  #onResize() {
    if (__SERVER__ || !this.el) return;

    const width = this.el.clientWidth,
      height = this.el.clientHeight;

    this.$state.width.set(width);
    this.$state.height.set(height);

    setStyle(this.el, '--player-width', width + 'px');
    setStyle(this.el, '--player-height', height + 'px');
  }

  #onPointerChange(queryList: MediaQueryList | MediaQueryListEvent) {
    if (__SERVER__) return;
    const pointer = queryList.matches ? 'coarse' : 'fine';
    setAttribute(this.el!, 'data-pointer', pointer);
    this.$state.pointer.set(pointer);
    this.#onResize();
  }

  /**
   * The current media provider.
   */
  @prop
  get provider(): AnyMediaProvider | null {
    return this.#provider;
  }

  /**
   * Media controls settings.
   */
  @prop
  get controls(): MediaControls {
    return this.#requestMgr.controls;
  }

  set controls(controls: boolean) {
    this.#props.controls.set(controls);
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
    return peek(this.$state.title);
  }

  set title(newTitle) {
    if (this.#skipTitleUpdate) {
      this.#skipTitleUpdate = false;
      return;
    }

    this.#props.title.set(newTitle);
  }

  /**
   * A list of all `VideoQuality` objects representing the set of available video renditions.
   *
   * @see {@link https://vidstack.io/docs/player/api/video-quality}
   */
  @prop
  get qualities(): VideoQualityList {
    return this.#media.qualities;
  }

  /**
   * A list of all `AudioTrack` objects representing the set of available audio tracks.
   *
   * @see {@link https://vidstack.io/docs/player/api/audio-tracks}
   */
  @prop
  get audioTracks(): AudioTrackList {
    return this.#media.audioTracks;
  }

  /**
   * A list of all `TextTrack` objects representing the set of available text tracks.
   *
   * @see {@link https://vidstack.io/docs/player/api/text-tracks}
   */
  @prop
  get textTracks(): TextTrackList {
    return this.#media.textTracks;
  }

  /**
   * Contains text renderers which are responsible for loading, parsing, and rendering text
   * tracks.
   */
  @prop
  get textRenderers(): TextRenderers {
    return this.#media.textRenderers;
  }

  @prop
  get duration() {
    return this.$state.duration();
  }

  set duration(duration: number) {
    this.#props.duration.set(duration);
  }

  @prop
  get paused() {
    return peek(this.$state.paused);
  }

  set paused(paused) {
    this.#queuePausedUpdate(paused);
  }

  #watchPaused() {
    this.#queuePausedUpdate(this.$props.paused());
  }

  #queuePausedUpdate(paused: boolean) {
    if (paused) {
      this.canPlayQueue.enqueue('paused', () => this.#requestMgr.pause());
    } else this.canPlayQueue.enqueue('paused', () => this.#requestMgr.play());
  }

  @prop
  get muted() {
    return peek(this.$state.muted);
  }

  set muted(muted) {
    this.#queueMutedUpdate(muted);
  }

  #watchMuted() {
    this.#queueMutedUpdate(this.$props.muted());
  }

  #queueMutedUpdate(muted: boolean) {
    this.canPlayQueue.enqueue('muted', () => {
      if (this.#provider) this.#provider.setMuted(muted);
    });
  }

  @prop
  get currentTime() {
    return peek(this.$state.currentTime);
  }

  set currentTime(time) {
    this.#queueCurrentTimeUpdate(time);
  }

  #watchCurrentTime() {
    this.#queueCurrentTimeUpdate(this.$props.currentTime());
  }

  #queueCurrentTimeUpdate(time: number) {
    this.canPlayQueue.enqueue('currentTime', () => {
      const { currentTime, clipStartTime, seekableStart, seekableEnd } = this.$state;

      if (time === peek(currentTime)) return;

      peek(() => {
        if (!this.#provider) return;

        const clippedTime = time + clipStartTime(),
          isStart = Math.floor(time) === Math.floor(seekableStart()),
          isEnd = Math.floor(clippedTime) === Math.floor(seekableEnd()),
          boundTime = isStart
            ? seekableStart()
            : isEnd
              ? seekableEnd()
              : Math.min(Math.max(seekableStart() + 0.1, clippedTime), seekableEnd() - 0.1);

        if (Number.isFinite(boundTime)) {
          this.#provider.setCurrentTime(boundTime);
        }
      });
    });
  }

  @prop
  get volume() {
    return peek(this.$state.volume);
  }

  set volume(volume) {
    this.#queueVolumeUpdate(volume);
  }

  #watchVolume() {
    this.#queueVolumeUpdate(this.$props.volume());
  }

  #queueVolumeUpdate(volume: number) {
    const clampedVolume = clampNumber(0, volume, 1);
    this.canPlayQueue.enqueue('volume', () => {
      if (this.#provider) this.#provider.setVolume(clampedVolume);
    });
  }

  @prop
  get playbackRate() {
    return peek(this.$state.playbackRate);
  }

  set playbackRate(rate) {
    this.#queuePlaybackRateUpdate(rate);
  }

  #watchPlaybackRate() {
    this.#queuePlaybackRateUpdate(this.$props.playbackRate());
  }

  #queuePlaybackRateUpdate(rate: number) {
    this.canPlayQueue.enqueue('rate', () => {
      if (this.#provider) (this.#provider as MediaProviderAdapter).setPlaybackRate?.(rate);
    });
  }

  #watchPlaysInline() {
    this.#queuePlaysInlineUpdate(this.$props.playsInline());
  }

  #queuePlaysInlineUpdate(inline: boolean) {
    this.canPlayQueue.enqueue('playsinline', () => {
      if (this.#provider) (this.#provider as MediaProviderAdapter).setPlaysInline?.(inline);
    });
  }

  #watchStorage() {
    let storageValue = this.$props.storage(),
      storage: MediaStorage | null = isString(storageValue)
        ? new LocalMediaStorage()
        : storageValue;

    if (storage?.onChange) {
      const { source } = this.$state,
        playerId = isString(storageValue) ? storageValue : this.el?.id,
        mediaId = computed(this.#computeMediaId.bind(this));

      effect(() => storage!.onChange!(source(), mediaId(), playerId || undefined));
    }

    this.#media.storage = storage;
    this.#media.textTracks.setStorage(storage);

    onDispose(() => {
      storage?.onDestroy?.();
      this.#media.storage = null;
      this.#media.textTracks.setStorage(null);
    });
  }

  #computeMediaId() {
    const { clipStartTime, clipEndTime } = this.$props,
      { source } = this.$state,
      src = source();
    return src.src ? `${src.src}:${clipStartTime()}:${clipEndTime()}` : null;
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
    return this.#requestMgr.play(trigger);
  }

  /**
   * Pauses playback of the media. This method will throw if called before media is ready for
   * playback.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause}
   */
  @method
  async pause(trigger?: Event) {
    return this.#requestMgr.pause(trigger);
  }

  /**
   * Attempts to display the player in fullscreen. The promise will resolve if successful, and
   * reject if not. This method will throw if any fullscreen API is _not_ currently available.
   *
   * @see {@link https://vidstack.io/docs/player/api/fullscreen}
   */
  @method
  async enterFullscreen(target?: MediaFullscreenRequestTarget, trigger?: Event) {
    return this.#requestMgr.enterFullscreen(target, trigger);
  }

  /**
   * Attempts to display the player inline by exiting fullscreen. This method will throw if any
   * fullscreen API is _not_ currently available.
   *
   * @see {@link https://vidstack.io/docs/player/api/fullscreen}
   */
  @method
  async exitFullscreen(target?: MediaFullscreenRequestTarget, trigger?: Event) {
    return this.#requestMgr.exitFullscreen(target, trigger);
  }

  /**
   * Attempts to display the player in picture-in-picture mode. This method will throw if PIP is
   * not supported. This method will also return a `PictureInPictureWindow` if the current
   * provider supports it.
   *
   * @see {@link https://vidstack.io/docs/player/api/picture-in-picture}
   */
  @method
  enterPictureInPicture(trigger?: Event) {
    return this.#requestMgr.enterPictureInPicture(trigger);
  }

  /**
   * Attempts to display the player in inline by exiting picture-in-picture mode. This method
   * will throw if not supported.
   *
   * @see {@link https://vidstack.io/docs/player/api/picture-in-picture}
   */
  @method
  exitPictureInPicture(trigger?: Event) {
    return this.#requestMgr.exitPictureInPicture(trigger);
  }

  /**
   * Sets the current time to the live edge (i.e., `duration`). This is a no-op for non-live
   * streams and will throw if called before media is ready for playback.
   *
   * @see {@link https://vidstack.io/docs/player/api/live}
   */
  @method
  seekToLiveEdge(trigger?: Event): void {
    this.#requestMgr.seekToLiveEdge(trigger);
  }

  /**
   * Called when media can begin loading. Calling this method will trigger the initial provider
   * loading process. Calling it more than once has no effect.
   *
   * @see {@link https://vidstack.io/docs/player/core-concepts/loading#load-strategies}
   */
  @method
  startLoading(trigger?: Event): void {
    this.#media.notify('can-load', undefined, trigger);
  }

  /**
   * Called when the poster image can begin loading. Calling it more than once has no effect.
   *
   * @see {@link https://vidstack.io/docs/player/core-concepts/loading#load-strategies}
   */
  @method
  startLoadingPoster(trigger?: Event) {
    this.#media.notify('can-load-poster', undefined, trigger);
  }

  /**
   * Request Apple AirPlay picker to open.
   */
  @method
  requestAirPlay(trigger?: Event) {
    return this.#requestMgr.requestAirPlay(trigger);
  }

  /**
   * Request Google Cast device picker to open. The Google Cast framework will be loaded if it
   * hasn't yet.
   */
  @method
  requestGoogleCast(trigger?: Event) {
    return this.#requestMgr.requestGoogleCast(trigger);
  }

  /**
   * Set the audio gain, amplifying volume and enabling a maximum volume above 100%.
   *
   * @see {@link https://vidstack.io/docs/player/api/audio-gain}
   */
  @method
  setAudioGain(gain: number, trigger?: Event) {
    return this.#requestMgr.setAudioGain(gain, trigger);
  }

  override destroy() {
    super.destroy();
    this.#media.remote.setPlayer(null);
    this.dispatch('destroy');
  }
}
