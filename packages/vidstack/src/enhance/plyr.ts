import '../elements/bundles/player';
import '../elements/bundles/player-layouts/plyr';

import {
  createDisposalBin,
  DOMEvent,
  isBoolean,
  isString,
  kebabToCamelCase,
  listenEvent,
  setAttribute,
  setStyle,
} from 'maverick.js/std';

import type { PlyrLayoutProps, PlyrLayoutTranslations } from '../components';
import {
  mediaState,
  type MediaPlayerProps,
  type MediaPlayerState,
  type MediaViewType,
  type PlayerSrc,
  type TextTrackInit,
} from '../core';
import type * as ME from '../core/api/media-events';
import type { MediaPlayerElement, MediaPlyrLayoutElement, MediaProviderElement } from '../elements';
import type { LogLevel } from '../foundation/logger/log-level';
import type { HTMLMediaProvider } from '../providers/html/provider';
import {
  isHTMLAudioElement,
  isHTMLIFrameElement,
  isHTMLVideoElement,
} from '../providers/type-check';
import { isHTMLElement } from '../utils/dom';
import type { FileDownloadInfo } from '../utils/network';
import { canPlayVideoType } from '../utils/support';

let activePlyr: Plyr | null = null,
  defaults = mediaState.record,
  forwardedPlayerState = [
    'playing',
    'paused',
    'ended',
    'currentTime',
    'seeking',
    'duration',
    'volume',
    'muted',
    'loop',
    'poster',
  ],
  eventMap: Record<string, keyof ME.MediaEvents> = {
    ratechange: 'rate-change',
    ready: 'can-play',
    timeupdate: 'time-update',
    volumechange: 'volume-change',
  },
  icons = [
    'airplay',
    'captions-off',
    'captions-on',
    'download',
    'enter-fullscreen',
    'exit-fullscreen',
    'fast-forward',
    'muted',
    'pause',
    'pip',
    'play',
    'restart',
    'rewind',
    'settings',
    'volume',
  ];

export class Plyr implements PlyrProps, PlyrMethods {
  static setup(targets: string | NodeList | HTMLElement[], config?: PlyrConfig) {
    if (isString(targets)) {
      targets = document.querySelectorAll<HTMLElement>(targets);
    }

    return [...targets].map((target) => new Plyr(target as HTMLElement, config));
  }

  static supported(type: 'audio' | 'video', provider: 'html5' | 'youtube' | 'vimeo') {
    // Nothing really to check here, added for legacy reasons.
    return true;
  }

  readonly player: MediaPlayerElement;
  readonly provider: MediaProviderElement;
  readonly layout: MediaPlyrLayoutElement;
  readonly fullscreen = new PlyrFullscreenAdapter(this);

  // These are only included for type defs, props are defined in constructor.
  playing = defaults.playing;
  paused = defaults.paused;
  ended = defaults.ended;
  currentTime = defaults.currentTime;
  seeking = defaults.seeking;
  duration = defaults.duration;
  volume = defaults.volume;
  muted = defaults.muted;
  loop = defaults.loop;
  poster = defaults.poster;

  get type() {
    return this.player.provider?.type ?? '';
  }

  get isHTML5() {
    return /audio|video|hls/.test(this.type);
  }

  get isEmbed() {
    return /youtube|vimeo/.test(this.type);
  }

  get buffered() {
    const { bufferedEnd, seekableEnd } = this.player.state;
    return seekableEnd > 0 ? bufferedEnd / seekableEnd : 0;
  }

  get stopped() {
    return this.paused && this.currentTime === 0;
  }

  get hasAudio() {
    if (!this.isHTML5) return true;

    const media: any = (this.player.provider as HTMLMediaProvider).media;

    return Boolean(
      media.mozHasAudio ||
        media.webkitAudioDecodedByteCount ||
        media.audioTracks?.length ||
        this.player.audioTracks.length,
    );
  }

  get speed() {
    return this.player.playbackRate;
  }

  set speed(speed) {
    this.player.remoteControl.changePlaybackRate(speed);
  }

  get currentTrack() {
    return this.player.textTracks.selectedIndex;
  }

  set currentTrack(index) {
    this.player.remoteControl.changeTextTrackMode(index, 'showing');
  }

  get pip() {
    return this.player.state.pictureInPicture;
  }

  set pip(isActive) {
    if (isActive) this.player.enterPictureInPicture();
    else this.player.exitPictureInPicture();
  }

  get quality() {
    return this.player.state.quality?.height ?? null;
  }

  set quality(value) {
    let qualities = this.player.qualities,
      index = -1;

    if (value !== null) {
      let minScore = Infinity;
      for (let i = 0; i < qualities.length; i++) {
        const score = Math.abs(qualities[i]!.height - value);
        if (score < minScore) {
          index = i;
          minScore = score;
        }
      }
    }

    this.player.remoteControl.changeQuality(index);
  }

  private _source: PlyrSource | null = null;
  get source() {
    return this._source;
  }

  set source(source) {
    const {
      type: viewType = 'video',
      sources = '',
      title = '',
      poster = '',
      thumbnails = '',
      tracks = [],
    } = source ?? {};

    this.player.src = sources;
    this.player.viewType = viewType;
    this.player.title = title;
    this.player.poster = poster;
    this.layout.thumbnails = thumbnails;

    this.player.textTracks.clear();
    for (const track of tracks) this.player.textTracks.add(track);

    this._source = source;
  }

  private _ratio: string | null = null;
  get ratio() {
    return this._ratio;
  }

  set ratio(ratio) {
    if (ratio) ratio = ratio.replace(/\s*:\s*/, ' / ');
    setStyle(this.player, 'aspect-ratio', ratio ?? 'unset');
    this._ratio = ratio;
  }

  get download() {
    return this.layout.download;
  }

  set download(download) {
    this.layout.download = download;
  }

  private _disposal = createDisposalBin();

  constructor(
    readonly target: PlyrTarget,
    readonly config: Partial<PlyrConfig> = {},
  ) {
    if (__SERVER__) {
      throw Error('[plyr] can not create player on server.');
    }

    if (isString(target)) {
      target = document.querySelector(target) as HTMLElement;
    } else if (!isHTMLElement(target)) {
      target = target[0] as HTMLElement;
    }

    if (!isHTMLElement(target)) {
      throw Error(`[plyr] target must be of type \`HTMLElement\`, found \`${typeof target}\``);
    }

    const dataConfig = target.getAttribute('data-plyr-config');
    if (dataConfig) {
      try {
        config = { ...config, ...JSON.parse(dataConfig) };
      } catch (error) {
        if (__DEV__) {
          console.error(`[plyr] failed to parse \`data-plyr-config\`\n\n`, error);
        }
      }
    }

    const {
      enabled = true,
      debug = __DEV__ ? 'warn' : 'error',
      autoPause = true,
      ratio = null,
      hideControls = true,
      resetOnEnd = false,
      disableContextMenu = true,
      iconUrl = null,
      iconPrefix = 'plyr',
      keyboard = { focused: true, global: false },
      i18n = null,
      ...props
    } = config;

    this.player = document.createElement('media-player');
    this.provider = document.createElement('media-provider');
    this.layout = document.createElement('media-plyr-layout');

    if (!enabled) return;

    for (const prop of forwardedPlayerState) {
      Object.defineProperty(this, prop, {
        get: () => this.player[prop],
        set: (value) => void (this.player[prop] = value),
      });
    }

    if (isString(debug)) {
      this.player.logLevel = debug;
    } else if (debug) {
      this.player.logLevel = 'warn';
    }

    if (autoPause) {
      this._disposal.add(listenEvent(this.player, 'play', this._onPlay.bind(this)));
    }

    this.ratio = ratio;
    this.layout.translations = i18n;

    if (!hideControls) {
      this.player.controls.canIdle = false;
    }

    if (resetOnEnd) {
      this._disposal.add(listenEvent(this.player, 'ended', this._onReset.bind(this)));
    }

    if (disableContextMenu) {
      // need to activate blocker somehow in provider element.
    }

    if (iconUrl) {
      this.layout.customIcons = true;

      const id = `sprite-${iconPrefix}`,
        exists = document.getElementById(id);

      const addIcons = () => {
        for (const icon of icons) {
          const namepsace = 'http://www.w3.org/2000/svg';

          const svg = document.createElementNS(namepsace, 'svg');
          setAttribute(svg, 'fill', 'none');
          setAttribute(svg, 'slot', `${icon}-icon`);
          setAttribute(svg, 'aria-hidden', 'true');
          setAttribute(svg, 'viewBox', '0 0 18 18');

          const use = document.createElementNS(namepsace, 'use');
          use.setAttributeNS('http://www.w3.org/1999/xlink', 'href', `#${iconPrefix}-${icon}`);
          svg.append(use);

          this.layout.append(svg);
        }
      };

      if (!exists) {
        fetch(iconUrl)
          .then((response) => response.text())
          .then((data) => {
            const container = document.createElement('div');
            setAttribute(container, 'id', id);
            setAttribute(container, 'hidden', '');

            container.innerHTML = data;

            document.body.insertAdjacentElement('afterbegin', container);

            addIcons();
          })
          .catch((error) => {
            if (__DEV__) {
              console.error('[plyr] failed tol oad sprite:\n\n', error);
            }

            this.layout.customIcons = false;
          });
      } else {
        addIcons();
      }
    }

    if (keyboard.global) {
      this.player.keyTarget = 'document';
    } else if (keyboard.focused) {
      this.player.keyTarget = 'player';
    } else {
      this.player.keyDisabled = true;
    }

    target.removeAttribute('controls');

    const title = target.getAttribute('title');
    if (title) this.player.setAttribute('title', title);

    const width = target.getAttribute('width'),
      height = target.getAttribute('height');

    if (width || height) {
      if (width) this.player.style.width = width;
      if (height) this.player.style.height = height;
      this.player.style.aspectRatio = 'unset';
    }

    for (const attr of target.attributes) {
      const name = attr.name.replace('data-', ''),
        propName = kebabToCamelCase(name);
      if (propName in this.player) {
        this.player.setAttribute(name, attr.value);
      } else if (propName in this.layout) {
        this.layout.setAttribute(name, attr.value);
      }
    }

    for (const [prop, value] of Object.entries(props)) {
      if (prop in this.player) {
        this.player[prop] = value;
      } else if (prop in this.layout) {
        this.layout[prop] = value;
      }
    }

    this.player.append(this.provider, this.layout);

    const isTargetContainer =
      !isHTMLAudioElement(target) && !isHTMLVideoElement(target) && !isHTMLIFrameElement(target);

    if (isTargetContainer) {
      target.append(this.player);
    } else {
      // Copy over source/track elements.
      for (const child of [...target.children]) this.provider.append(child);
      target.replaceWith(this.player);
    }

    const embedProvider = target.getAttribute('data-plyr-provider'),
      embedId = target.getAttribute('data-plyr-embed-id');

    if (embedProvider && /youtube|vimeo/.test(embedProvider) && embedId) {
      this.player.src = `${embedProvider}/${embedId}`;
    }
  }

  private _onPlay() {
    if (activePlyr !== this) activePlyr?.pause();
    activePlyr = this;
  }

  private _onReset() {
    this.currentTime = 0;
    this.paused = true;
  }

  play() {
    return this.player.play();
  }

  pause() {
    return this.player.pause();
  }

  togglePlay(toggle = this.paused) {
    if (toggle) {
      return this.player.play();
    } else {
      return this.player.pause();
    }
  }

  toggleCaptions(toggle = !this.player.textTracks.selected) {
    const controller = this.player.remoteControl;
    if (toggle) {
      controller.showCaptions();
    } else {
      controller.disableCaptions();
    }
  }

  toggleControls(toggle = !this.player.controls.showing) {
    const controls = this.player.controls;
    if (toggle) {
      controls.show();
    } else {
      controls.hide();
    }
  }

  restart() {
    this.currentTime = 0;
  }

  stop() {
    this.pause();
    this.player.currentTime = 0;
  }

  forward(seekTime = this.config.seekTime ?? 10) {
    this.currentTime += seekTime;
  }

  rewind(seekTime = this.config.seekTime ?? 10) {
    this.currentTime -= seekTime;
  }

  increaseVolume(step = 5) {
    this.volume += step;
  }

  decreaseVolume(step = 5) {
    this.volume -= step;
  }

  airplay() {
    return this.player.requestAirPlay();
  }

  on<T extends keyof PlyrEvents>(type: T, callback: (event: PlyrEvents[T]) => void) {
    this._listen(type, callback);
  }

  once<T extends keyof PlyrEvents>(type: T, callback: (event: PlyrEvents[T]) => void) {
    this._listen(type, callback, { once: true });
  }

  off<T extends keyof PlyrEvents>(type: T, callback: (event: PlyrEvents[T]) => void) {
    this._listen(type, callback, { remove: true });
  }

  private _listeners: {
    type: string;
    callback: any;
    listener: any;
  }[] = [];

  private _listen<T extends keyof PlyrEvents>(
    type: T,
    callback: (event: any) => void,
    options: { remove?: boolean; once?: boolean } = {},
  ) {
    let eventType: string = type,
      toggle: boolean | null = null;

    switch (type) {
      case 'captionsenabled':
      case 'captionsdisabled':
        eventType = 'text-track-change';
        toggle = type === 'captionsenabled';
        break;
      case 'controlsshown':
      case 'controlshidden':
        eventType = 'controls-change';
        toggle = type === 'controlsshown';
        break;
      case 'enterfullscreen':
      case 'exitfullscreen':
        eventType = 'fullscreen-change';
        toggle = type === 'enterfullscreen';
        break;
      default:
    }

    const mappedEventType = eventMap[eventType] ?? eventType;

    const listener: any = (event: CustomEvent<unknown>) => {
      if (isBoolean(toggle) && !!event.detail !== toggle) return;

      if (mappedEventType !== type) {
        callback(new DOMEvent(type, { ...event, trigger: event }));
        return;
      }

      callback(event);
    };

    if (options.remove) {
      let index = -1;
      do {
        index = this._listeners.findIndex((t) => t.type === type && t.callback === callback);
        if (index >= 0) {
          const { listener } = this._listeners[index]!;
          this.player.removeEventListener(mappedEventType, listener);
          this._listeners.splice(index, 1);
        }
      } while (index >= 0);
    } else {
      this._listeners.push({ type, callback, listener });
      this.player.addEventListener(mappedEventType, listener, { once: options.once });
    }
  }

  supports(type: string) {
    return !!type && canPlayVideoType(null, type);
  }

  destroy() {
    for (const { type, listener } of this._listeners) {
      this.player.removeEventListener(eventMap[type] ?? type, listener);
    }

    this._source = null;
    this._listeners.length = 0;
    if (activePlyr === this) activePlyr = null;

    this._disposal.empty();
    this.player.destroy();
  }
}

export type PlyrTarget = string | HTMLElement | NodeList | HTMLElement[];

export interface PlyrConfig
  extends Partial<Omit<MediaPlayerProps, 'controls'>>,
    Partial<PlyrLayoutProps> {
  /**
   * Completely disable Plyr. This would allow you to do a User Agent check or similar to
   * programmatically enable or disable Plyr for a certain UA.
   *
   * @defaultValue true
   * @example
   * ```ts
   * enabled: !/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)
   * ```
   */
  enabled: boolean;
  /**
   * Display debugging information in the console.
   *
   * @defaultValue 'warn'
   */
  debug: boolean | LogLevel;
  /**
   * Only allow one player playing at once.
   *
   * @defaultValue true
   */
  autoPause: boolean;
  /**
   * Gets or sets the video aspect ratio.
   *
   * @defaultValue 16/9
   */
  ratio: string | null;
  /**
   * Hide video controls automatically after 2s of no mouse or focus movement, on control element
   * blur (tab out), on playback start or entering fullscreen. As soon as the mouse is moved,
   * a control element is focused or playback is paused, the controls reappear instantly.
   *
   * @defaultValue true
   */
  hideControls: boolean;
  /**
   * Reset the playback to the start once playback is complete.
   *
   * @defaultValue false
   */
  resetOnEnd: boolean;
  /**
   * Disable right click menu on video to help as very primitive obfuscation to prevent downloads
   * of content.
   *
   * @defaultValue true
   */
  disableContextMenu: boolean;
  /**
   * Specify a URL or path to the SVG sprite. See the SVG section for more info.
   *
   * @defaultValue null
   */
  iconUrl: string | null;
  /**
   * Specify the id prefix for the icons used in the default controls (e.g. "plyr-play" would be
   * "plyr"). This is to prevent clashes if you're using your own SVG sprite but with the default
   * controls. Most people can ignore this option.
   *
   * @defaultValue 'plyr'
   */
  iconPrefix: 'plyr';
  /**
   * Enable keyboard shortcuts for focused players only or globally.
   *
   * @defaultValue `{ focused: true, global: false }`
   */
  keyboard: PlyrKeyboardConfig;
  /**
   * Used for internationalization (i18n) of the text within the UI.
   *
   * @defaultValue  null
   */
  i18n: PlyrI18nConfig | null;
}

export interface PlyrKeyboardConfig {
  /**
   * Enable keyboard shortcuts when the player is focused.
   *
   * @defaultValue true
   */
  focused: boolean;
  /**
   * Enable keyboard shortcuts globally.
   *
   * @defaultValue false
   */
  global: boolean;
}

export interface PlyrStorageConfig {
  /**
   * Allow use of local storage to store user settings.
   *
   * @defaultValue true
   */
  enabled: boolean;
  /**
   * The storage key prefix to use.
   *
   * @defaultValue 'plyr'
   */
  key: string;
}

export interface PlyrI18nConfig extends Partial<PlyrLayoutTranslations> {}

export interface PlyrProps
  extends Pick<
    MediaPlayerState,
    | 'playing'
    | 'paused'
    | 'ended'
    | 'currentTime'
    | 'seeking'
    | 'duration'
    | 'volume'
    | 'muted'
    | 'loop'
    | 'poster'
  > {
  /**
   * Returns a boolean indicating if the current player is HTML5.
   */
  readonly isHTML5: boolean;
  /**
   * Returns a boolean indicating if the current player is an embedded player.
   */
  readonly isEmbed: boolean;
  /**
   * Returns a float between 0 and 1 indicating how much of the media is buffered
   */
  readonly buffered: number;
  /**
   * Returns a boolean indicating if the current player is stopped.
   */
  readonly stopped: boolean;
  /**
   *  Returns a boolean indicating if the current media has an audio track.
   */
  readonly hasAudio: boolean;
  /**
   * Fullscreen state and methods.
   */
  readonly fullscreen: PlyrFullscreenAdapter;
  /**
   * Gets or sets the speed for the player. Generally the minimum should be 0.5.
   */
  speed: number;
  /**
   * Gets or sets the caption track by index. -1 means the track is missing or captions is not
   * active.
   */
  currentTrack: number;
  /**
   * Gets or sets the picture-in-picture state of the player.
   */
  pip: boolean;
  /**
   * Gets or sets the quality for the player based on height. Setting to -1 will use auto quality.
   */
  quality: number | null;
  /**
   * Gets or sets the current source for the player.
   */
  source: PlyrSource | null;
  /**
   * Gets or sets the video aspect ratio.
   */
  ratio: string | null;
  /**
   * Gets or sets the URL for the download button.
   */
  download: FileDownloadInfo;
}

export interface PlyrSource {
  title?: string;
  type?: MediaViewType;
  sources: PlayerSrc;
  poster?: string;
  thumbnails?: string;
  tracks?: TextTrackInit[];
}

export class PlyrFullscreenAdapter {
  constructor(private readonly _plyr: Plyr) {}

  private get _player() {
    return this._plyr.player;
  }

  /**
   * 	Returns a boolean indicating if the current player has fullscreen enabled.
   */
  get enabled() {
    return this._player.state.canFullscreen;
  }
  /**
   * Returns a boolean indicating if the current player is in fullscreen mode.
   */
  get active() {
    return this._player.state.fullscreen;
  }
  /**
   * Request to enter fullscreen.
   */
  enter() {
    return this._player.requestFullscreen();
  }
  /**
   * Request to exit fullscreen.
   */
  exit() {
    return this._player.exitFullscreen();
  }
  /**
   * Request to toggle fullscreen.
   */
  toggle() {
    if (this.active) return this.exit();
    else return this.enter();
  }
}

export interface PlyrMethods extends Pick<MediaPlayerElement, 'play' | 'pause' | 'destroy'> {
  /**
   * Toggle playback, if no parameters are passed, it will toggle based on current status.
   */
  togglePlay(toggle?: boolean): Promise<void>;
  /**
   * Stop playback and reset to start.
   */
  stop(): void;
  /**
   * Restart playback.
   */
  restart(): void;
  /**
   * Rewind playback by the specified seek time. If no parameter is passed, the default seek time
   * will be used.
   */
  rewind(seekTime?: number): void;
  /**
   * Fast forward by the specified seek time. If no parameter is passed, the default seek time
   * will be used.
   */
  forward(seekTime?: number): void;
  /**
   * Increase volume by the specified step. If no parameter is passed, the default step will be used.
   */
  increaseVolume(step?: number): void;
  /**
   * Reduce volume by the specified step. If no parameter is passed, the default step will be used.
   */
  decreaseVolume(step?: number): void;
  /**
   * Toggle captions display. If no parameter is passed, it will toggle based on current status.
   */
  toggleCaptions(toggle?: boolean): void;
  /**
   * Trigger the airplay dialog on supported devices.
   */
  airplay(): void;
  /**
   * Toggle the controls (video only). Takes optional truthy value to force it on/off.
   */
  toggleControls(toggle?: boolean): void;
  /**
   * Add an event listener for the specified event.
   */
  on<T extends keyof PlyrEvents>(type: T, callback: (event: PlyrEvents[T]) => void): void;
  /**
   * Add an event listener for the specified event once.
   */
  once<T extends keyof PlyrEvents>(type: T, callback: (event: PlyrEvents[T]) => void): void;
  /**
   * Remove an event listener for the specified event.
   */
  off<T extends keyof PlyrEvents>(type: T, callback: (event: PlyrEvents[T]) => void): void;
  /**
   * Check support for a mime type.
   */
  supports(type: string): boolean;
}

export interface PlyrEvents
  extends Pick<
    ME.MediaEvents,
    'ended' | 'pause' | 'play' | 'playing' | 'progress' | 'seeked' | 'seeking'
  > {
  captionsdisabled: ME.MediaTextTrackChangeEvent;
  captionsenabled: ME.MediaTextTrackChangeEvent;
  controlshidden: ME.MediaControlsChangeEvent;
  controlsshown: ME.MediaControlsChangeEvent;
  enterfullscreen: ME.MediaFullscreenChangeEvent;
  exitfullscreen: ME.MediaFullscreenChangeEvent;
  languagechange: Event;
  ratechange: ME.MediaRateChangeEvent;
  ready: ME.MediaCanPlayEvent;
  timeupdate: ME.MediaTimeUpdateEvent;
  volumechange: ME.MediaVolumeChangeEvent;
}

if (typeof window !== 'undefined') {
  (window as any).Plyr = Plyr;
}
