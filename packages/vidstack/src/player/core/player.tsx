import { computed, effect, peek, provideContext, signal } from 'maverick.js';
import {
  Component,
  ComponentInstance,
  defineElement,
  method,
  prop,
  type ElementAttributesRecord,
  type HTMLCustomElement,
} from 'maverick.js/element';
import {
  camelToKebabCase,
  isNull,
  listenEvent,
  setAttribute,
  uppercaseFirstChar,
} from 'maverick.js/std';

import { canFullscreen } from '../../foundation/fullscreen/controller';
import { Logger } from '../../foundation/logger/controller';
import { LogPrinter } from '../../foundation/logger/log-printer';
import { FocusVisibleController } from '../../foundation/observers/focus-visible';
import { ScreenOrientationController } from '../../foundation/orientation/controller';
import { RequestQueue } from '../../foundation/queue/request-queue';
import { setAttributeIfEmpty } from '../../utils/dom';
import { clampNumber } from '../../utils/number';
import { mediaContext, type MediaContext } from './api/context';
import { MEDIA_ATTRIBUTES } from './api/media-attrs';
import type { PlayerCSSVars } from './api/player-cssvars';
import type { FindPlayerEvent, PlayerConnectEvent, PlayerEvents } from './api/player-events';
import { mediaPlayerProps, type MediaStateAccessors, type PlayerProps } from './api/player-props';
import type { MediaFullscreenRequestTarget } from './api/request-events';
import { MediaStoreFactory, type MediaStore } from './api/store';
import { MediaKeyboardController } from './keyboard/controller';
import type { AnyMediaProvider, MediaProviderLoader } from './providers/types';
import { VideoQualityList } from './quality/video-quality';
import { MediaEventsLogger } from './state/media-events-logger';
import { MediaLoadController } from './state/media-load-controller';
import { MediaPlayerDelegate } from './state/media-player-delegate';
import { MediaRequestContext, MediaRequestManager } from './state/media-request-manager';
import { MediaStateManager } from './state/media-state-manager';
import { MediaStoreSync } from './state/media-store-sync';
import { MediaRemoteControl } from './state/remote-control';
import { ThumbnailsLoader } from './thumbnails/loader';
import { AudioTrackList } from './tracks/audio-tracks';
import { TextRenderers } from './tracks/text/render/text-renderer';
import { TEXT_TRACK_CROSSORIGIN } from './tracks/text/symbols';
import { isTrackCaptionKind } from './tracks/text/text-track';
import { TextTrackList } from './tracks/text/text-tracks';
import { MediaUserController } from './user';

declare global {
  interface MaverickElements {
    'media-player': MediaPlayerElement;
  }

  interface HTMLElementEventMap {
    'media-player-connect': PlayerConnectEvent;
    'find-media-player': FindPlayerEvent;
  }
}

/**
 * All media elements exist inside the `<media-player>` component. This component's main
 * responsibilities are to manage media state updates, dispatch media events, handle media
 * requests, and expose media state through HTML attributes and CSS properties for styling
 * purposes.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/media/player}
 * @slot - Used to pass in media components.
 * @example
 * ```html
 * <media-player src="...">
 *   <media-outlet></media-outlet>
 *   <!-- Other components that use/manage media state here. -->
 * </media-player>
 * ```
 */
export class Player extends Component<PlayerAPI> implements MediaStateAccessors {
  static el = defineElement<PlayerAPI>({
    tagName: 'media-player',
    props: mediaPlayerProps,
    store: MediaStoreFactory,
  });

  private _media: MediaContext;
  private _stateMgr: MediaStateManager;
  private _requestMgr: MediaRequestManager;
  private _canPlayQueue = new RequestQueue();

  private get _provider() {
    return this._media.$provider() as AnyMediaProvider | null;
  }

  constructor(instance: ComponentInstance<PlayerAPI>) {
    super(instance);

    this._initStore();
    new MediaStoreSync(instance);

    const context = {
      player: null,
      qualities: new VideoQualityList(),
      audioTracks: new AudioTrackList(),
      $provider: signal<MediaProvider | null>(null),
      $props: this.$props,
      $store: this.$store as MediaStore,
    } as MediaContext;

    if (__DEV__) {
      const logPrinter = new LogPrinter(instance);
      effect(() => {
        logPrinter.logLevel = this.$props.logLevel();
      });
    }

    if (__DEV__) context.logger = new Logger();
    context.remote = new MediaRemoteControl(__DEV__ ? context.logger : undefined);
    context.$iosControls = computed(this._isIOSControls.bind(this));
    context.textTracks = new TextTrackList();
    context.textTracks[TEXT_TRACK_CROSSORIGIN] = this.$props.crossorigin;
    context.textRenderers = new TextRenderers(context);
    context.ariaKeys = {};

    this._media = context;
    provideContext(mediaContext, context);

    this.user = new MediaUserController(instance);
    this.orientation = new ScreenOrientationController(instance);

    new FocusVisibleController(instance);
    new MediaKeyboardController(instance, context);
    new ThumbnailsLoader(instance);
    if (__DEV__) new MediaEventsLogger(instance, context);

    const request = new MediaRequestContext();
    this._stateMgr = new MediaStateManager(instance, request, context);
    this._requestMgr = new MediaRequestManager(instance, this._stateMgr, request, context);

    context.delegate = new MediaPlayerDelegate(
      this._stateMgr._handle.bind(this._stateMgr),
      context,
    );

    effect(this._watchCanPlay.bind(this));
    effect(this._watchMuted.bind(this));
    effect(this._watchPaused.bind(this));
    effect(this._watchVolume.bind(this));
    effect(this._watchCurrentTime.bind(this));
    effect(this._watchPlaysinline.bind(this));
    effect(this._watchPlaybackRate.bind(this));

    new MediaLoadController(instance, this.startLoading.bind(this));
  }

  protected override onAttach(el: HTMLElement): void {
    el.setAttribute('tabindex', '0');
    setAttributeIfEmpty(el, 'role', 'region');

    if (__SERVER__) this._watchTitle();
    else effect(this._watchTitle.bind(this));

    this._setMediaAttributes();
    this._setMediaVars();

    this._media.player = el as MediaPlayerElement;
    this._media.remote.setTarget(el);
    this._media.remote.setPlayer(el as MediaPlayerElement);

    listenEvent(el, 'find-media-player', this._onFindPlayer.bind(this));
  }

  protected override onConnect(el: HTMLElement) {
    this.dispatch('media-player-connect', {
      detail: this.el as MediaPlayerElement,
      bubbles: true,
      composed: true,
    });

    window.requestAnimationFrame(() => {
      if (isNull(this.$store.canLoadPoster())) {
        this.$store.canLoadPoster.set(true);
      }
    });

    if (__DEV__) {
      this._media.logger!.setTarget(el);
      return () => this._media.logger!.setTarget(null);
    }
  }

  private _initStore() {
    const providedProps = {
      viewType: 'providedViewType',
      streamType: 'providedStreamType',
    };

    for (const prop of Object.keys(this.$props)) {
      this.$store[providedProps[prop] ?? prop]?.set(this.$props[prop]());
    }

    if (__SERVER__) this._onProvidedTypesChange();
    else effect(this._onProvidedTypesChange.bind(this));

    this.$store.muted.set(this.$props.muted() || this.$props.volume() === 0);
  }

  private _watchTitle() {
    const { title, live, viewType } = this.$store,
      isLive = live(),
      type = uppercaseFirstChar(viewType()),
      typeText = type !== 'Unknown' ? `${isLive ? 'Live ' : ''}${type}` : isLive ? 'Live' : 'Media';
    setAttribute(
      this.el!,
      'aria-label',
      title() ? `${typeText} - ${title()}` : typeText + ' Player',
    );
  }

  private _watchCanPlay() {
    if (this.$store.canPlay() && this._provider) this._canPlayQueue._start();
    else this._canPlayQueue._stop();
  }

  private _onProvidedTypesChange() {
    this.$store.providedViewType.set(this.$props.viewType());
    this.$store.providedStreamType.set(this.$props.streamType());
  }

  private _setMediaAttributes() {
    const $attrs: ElementAttributesRecord = {
      'aspect-ratio': this.$props.aspectRatio,
      'data-captions': () => {
        const track = this.$store.textTrack();
        return !!track && isTrackCaptionKind(track);
      },
      'data-ios-controls': this._media.$iosControls,
    };

    const mediaAttrName = {
      canPictureInPicture: 'can-pip',
      pictureInPicture: 'pip',
    };

    for (const prop of MEDIA_ATTRIBUTES) {
      const attrName = 'data-' + (mediaAttrName[prop] ?? camelToKebabCase(prop));
      $attrs[attrName] = this.$store[prop] as () => string | number;
    }

    this.setAttributes($attrs);
  }

  private _setMediaVars() {
    this.setCSSVars({
      '--media-aspect-ratio': () => {
        const ratio = this.$props.aspectRatio();
        return ratio ? +ratio.toFixed(4) : null;
      },
      '--media-buffered': () => +this.$store.bufferedEnd().toFixed(3),
      '--media-current-time': () => +this.$store.currentTime().toFixed(3),
      '--media-duration': () => {
        const duration = this.$store.duration();
        return Number.isFinite(duration) ? +duration.toFixed(3) : 0;
      },
    });
  }

  private _onFindPlayer(event: FindPlayerEvent) {
    event.detail(this.el! as MediaPlayerElement);
  }

  private _isIOSControls() {
    return (
      !canFullscreen() &&
      this.$store.mediaType() === 'video' &&
      ((this.$store.controls() && !this.$props.playsinline()) || this.$store.fullscreen())
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
   * Media user settings which currently supports configuring user idling behavior.
   */
  @prop
  readonly user: MediaUserController;

  /**
   * Controls the screen orientation of the current browser window and dispatches orientation
   * change events on the player.
   */
  @prop
  readonly orientation: ScreenOrientationController;

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
    return this._provider?.paused ?? true;
  }

  set paused(paused) {
    if (paused) {
      this._canPlayQueue._enqueue('paused', () => this._requestMgr._pause());
    } else this._canPlayQueue._enqueue('paused', () => this._requestMgr._play());
  }

  private _watchPaused() {
    this.paused = this.$props.paused();
  }

  @prop
  get muted() {
    return this._provider?.muted ?? false;
  }

  set muted(muted) {
    this._canPlayQueue._enqueue('muted', () => (this._provider!.muted = muted));
  }

  private _watchMuted() {
    this.muted = this.$props.muted();
  }

  @prop
  get currentTime() {
    return this._provider?.currentTime ?? 0;
  }

  set currentTime(time) {
    this._canPlayQueue._enqueue('currentTime', () => {
      const adapter = this._provider;
      if (time !== adapter!.currentTime) {
        peek(() => {
          const boundTime = Math.min(
            Math.max(this.$store.seekableStart() + 0.1, time),
            this.$store.seekableEnd() - 0.1,
          );

          if (Number.isFinite(boundTime)) adapter!.currentTime = boundTime;
        });
      }
    });
  }

  private _watchCurrentTime() {
    this.currentTime = this.$props.currentTime();
  }

  @prop
  get volume() {
    return this._provider?.volume ?? 1;
  }

  set volume(volume) {
    this._canPlayQueue._enqueue('volume', () => (this._provider!.volume = volume));
  }

  private _watchVolume() {
    this.volume = clampNumber(0, this.$props.volume(), 1);
  }

  @prop
  get playsinline() {
    return this._provider?.playsinline ?? false;
  }

  set playsinline(inline) {
    this._canPlayQueue._enqueue('playsinline', () => (this._provider!.playsinline = inline));
  }

  private _watchPlaysinline() {
    this.playsinline = this.$props.playsinline();
  }

  @prop
  get playbackRate() {
    return this._provider?.playbackRate ?? 1;
  }

  set playbackRate(rate) {
    this._canPlayQueue._enqueue('rate', () => (this._provider!.playbackRate = rate));
  }

  private _watchPlaybackRate() {
    this.playbackRate = this.$props.playbackRate();
  }

  /**
   * Begins/resumes playback of the media. If this method is called programmatically before the
   * user has interacted with the player, the promise may be rejected subject to the browser's
   * autoplay policies. This method will throw if called before media is ready for playback.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play}
   */
  @method
  async play() {
    return this._requestMgr._play();
  }

  /**
   * Pauses playback of the media. This method will throw if called before media is ready for
   * playback.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause}
   */
  @method
  async pause() {
    return this._requestMgr._pause();
  }

  /**
   * Attempts to display the player in fullscreen. The promise will resolve if successful, and
   * reject if not. This method will throw if any fullscreen API is _not_ currently available.
   *
   * @see {@link https://vidstack.io/docs/player/core-concepts/fullscreen}
   */
  @method
  async enterFullscreen(target?: MediaFullscreenRequestTarget) {
    return this._requestMgr._enterFullscreen(target);
  }

  /**
   * Attempts to display the player inline by exiting fullscreen. This method will throw if any
   * fullscreen API is _not_ currently available.
   *
   * @see {@link https://vidstack.io/docs/player/core-concepts/fullscreen}
   */
  @method
  async exitFullscreen(target?: MediaFullscreenRequestTarget) {
    return this._requestMgr._exitFullscreen(target);
  }

  /**
   * Attempts to display the player in picture-in-picture mode. This method will throw if PIP is
   * not supported. This method will also return a `PictureInPictureWindow` if the current
   * provider supports it.
   *
   * @see {@link https://vidstack.io/docs/player/core-concepts/picture-in-picture}
   */
  @method
  enterPictureInPicture() {
    return this._requestMgr._enterPictureInPicture();
  }

  /**
   * Attempts to display the player in inline by exiting picture-in-picture mode. This method
   * will throw if not supported.
   *
   * @see {@link https://vidstack.io/docs/player/core-concepts/picture-in-picture}
   */
  @method
  exitPictureInPicture() {
    return this._requestMgr._exitPictureInPicture();
  }

  /**
   * Sets the current time to the live edge (i.e., `duration`). This is a no-op for non-live
   * streams and will throw if called before media is ready for playback.
   *
   * @see {@link https://vidstack.io/docs/player/core-concepts/live#live-edge}
   */
  @method
  seekToLiveEdge(): void {
    this._requestMgr._seekToLiveEdge();
  }

  /**
   * Called when media can begin loading. Calling this method will trigger the initial provider
   * loading process. Calling it more than once has no effect.
   *
   * @see {@link https://vidstack.io/docs/player/core-concepts/loading#loading-strategies}
   */
  @method
  startLoading(): void {
    this._media.delegate._dispatch('can-load');
  }

  override destroy() {
    this.dispatch('destroy');
  }
}

export interface PlayerAPI {
  props: PlayerProps;
  events: PlayerEvents;
  cssvars: PlayerCSSVars;
  store: typeof MediaStoreFactory;
}

export interface MediaPlayerElement extends HTMLCustomElement<Player> {}
