import { google } from '@alugha/ima';
import { computed, peek } from 'maverick.js';
import { ComponentController, ComponentInstance } from 'maverick.js/element';
import { DisposalBin, DOMEvent, isString, useDisposalBin } from 'maverick.js/std';

import { type MediaContext } from '../api/context';
import { PlayerAPI } from '../player';
import { ImaSdkLoader } from './lib-loader';
import type { ImaSdk } from './types';

export class AdsController extends ComponentController<PlayerAPI> {
  protected _libraryUrl: string = '//imasdk.googleapis.com/js/sdkloader/ima3.js';
  protected _sdk: typeof google.ima | null = null;
  protected _adDisplayContainer: google.ima.AdDisplayContainer | null = null;
  protected _adsLoader: google.ima.AdsLoader | null = null;
  protected _adsRequest: google.ima.AdsRequest | null = null;
  protected _adsManager: google.ima.AdsManager | null = null;
  protected _resizeObserver: ResizeObserver | null = null;
  protected _disposablBin: DisposalBin = useDisposalBin();

  protected _adEventsToDispatch: EventDispatchMapping = {
    adBreakReady: 'ad_break_ready',
    adBuffering: 'ad_buffering',
    adMetadata: 'ad_metadata',
    adProgress: 'ad_progress',
    allAdsCompleted: 'ad_all_complete',
    click: 'ad_click',
    complete: 'ad_complete',
    contentPauseRequested: 'content_pause_requested',
    contentResumeRequested: 'content_resume_requested',
    durationChange: 'ad_duration_change',
    firstQuartile: 'ad_first_quartile',
    impression: 'ad_impression',
    interaction: 'ad_interaction',
    linearChanged: 'ad_linear_changed',
    loaded: 'ad_loaded',
    log: 'ad_log',
    midpoint: 'ad_midpoint',
    pause: 'ad_pause',
    resume: 'ad_resume',
    skippableStateChanged: 'ad_skippable_state_changed',
    skip: 'ad_skip',
    start: 'ad_start',
    thirdQuartile: 'ad_third_quartile',
    userClose: 'ad_user_close',
    volumeChange: 'ad_volume_change',
    mute: 'ad_mute',
    adCanPlay: 'ad_can_play',
  };

  protected _adEventHandlerMapping: EventHandlerMapping = {
    adBuffering: this._onAdBuffering,
    pause: this._onAdPause,
    resume: this._onAdResume,
    start: this._onAdStart,
    volumeChange: this._onAdVolumeChange,
    mute: this._onAdMute,
    adProgress: this._onAdProgress,
    complete: this._onAdComplete,
    contentPauseRequested: this._onContentPauseRequested,
    contentResumeRequested: this._onContentResumeRequested,
    loaded: this._onAdLoaded,
    adCanPlay: this._onAdCanPlay,
  };

  constructor(instance: ComponentInstance<PlayerAPI>, protected _media: MediaContext) {
    super(instance);
    console.log('AdsController constructor');

    this.setAttributes({
      'data-ads-paused': computed(() => !this.$store.adPlaying() && !this.$store.adStarted()),
      'data-ads-playing': this.$store.adPlaying,
      'data-ads-buffering': this.$store.adBuffering,
      'data-ads-can-play': this.$store.adCanPlay,
      'data-ads-started': this.$store.adStarted,
    });

    new ImaSdkLoader(this._libraryUrl, _media, (imaSdk) => {
      console.log('imaSdk loaded', imaSdk);
      this.setup(imaSdk);

      this.listen('play', this.loadAds.bind(this));
      this.listen('ended', this._onContentEnded.bind(this));
      this.listen('fullscreen-change', this._onFullscreenChange.bind(this));
    });
  }

  protected setup(imaSdk: ImaSdk) {
    console.log('setup ads', imaSdk, this._media);
    const adContainer = document.createElement('media-ads');
    this._media.player?.append(adContainer);

    this._sdk = imaSdk;
    this._sdk.settings.setDisableCustomPlaybackForIOS10Plus(true);
    this._sdk.settings.setVpaidMode(this._sdk.ImaSdkSettings.VpaidMode.ENABLED);

    this._adDisplayContainer = new imaSdk.AdDisplayContainer(
      adContainer,
      this._media.player! as unknown as HTMLVideoElement,
    );
    this._adsLoader = new imaSdk.AdsLoader(this._adDisplayContainer);

    this._addEventListener(
      this._adsLoader,
      this._sdk.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
      this._onAdsManagerLoaded.bind(this),
    );
    this._addEventListener(
      this._adsLoader,
      this._sdk.AdErrorEvent.Type.AD_ERROR,
      this._onAdsManagerAdError.bind(this),
    );

    if (!__SERVER__ && window.ResizeObserver) {
      this._resizeObserver = new ResizeObserver(this._onResized.bind(this));
      this._resizeObserver.observe(this._media.player!);
    }

    this._adsRequest = new this._sdk.AdsRequest();
    this._adsRequest.adTagUrl = this.$props.adsUrl()!;

    // Specify the linear and nonlinear slot sizes. This helps the SDK to
    // select the correct creative if multiple are returned.
    this._adsRequest.linearAdSlotWidth = this._media.player!.clientWidth;
    this._adsRequest.linearAdSlotHeight = this._media.player!.clientHeight;
    this._adsRequest.nonLinearAdSlotWidth = this._media.player!.clientWidth;
    this._adsRequest.nonLinearAdSlotHeight = this._media.player!.clientHeight / 3;

    this._adsRequest.forceNonLinearFullSlot = false;

    // Mute ads based on current state
    this._adsRequest.setAdWillPlayMuted(!this._media.$store.muted());

    // Pass the request to the adsLoader to request ads
    this._adsLoader.requestAds(this._adsRequest);
  }

  protected override onDisconnect() {
    this._disposablBin.empty(); // removes all the listeners
    this._adsManager?.destroy();
    this._adsLoader?.destroy();
    this._resizeObserver?.disconnect();
  }

  protected loadAds() {
    console.log('loadAds');
    // Prevent this function from running on if there are already ads loaded
    if (this.$store.adsLoaded()) {
      return;
    }
    this.$store.adsLoaded.set(true);

    this._adDisplayContainer?.initialize();

    var width = this._media.player!.clientWidth;
    var height = this._media.player!.clientHeight;
    try {
      this._adsManager!.init(
        width,
        height,
        peek(this._media.$store.fullscreen)
          ? this._sdk!.ViewMode.FULLSCREEN
          : this._sdk!.ViewMode.NORMAL,
      );
      this._adsManager!.start();
    } catch (adError) {
      // Play the video without ads, if an error occurs
      console.log('AdsManager could not be started', adError);
    }
  }

  protected _getEnabled() {
    return (
      (this._media.$provider()?.type === 'video' || this._media.$provider()?.type === 'hls') &&
      isString(this.$props.adsUrl())
    );
  }

  private _addEventListener(target: any, event: any, handler: (...args: any) => any) {
    target.addEventListener(event, handler);
    this._disposablBin.add(() => target.removeEventListener(event, handler));
  }

  private _onResized() {
    if (this._adsManager) {
      this._adsManager.resize(
        this._media.player!.clientWidth,
        this._media.player!.clientHeight,
        this._sdk!.ViewMode.NORMAL,
      );
    }
  }

  private _onContentEnded() {
    if (this._adsLoader) {
      this._adsLoader.contentComplete();
    }
  }

  private _onFullscreenChange() {
    let { fullscreen } = this.$store;
    if (this._adsManager && this._media.player && this._sdk) {
      this._adsManager.resize(
        this._media.player.clientWidth,
        this._media.player.clientHeight,
        fullscreen() ? this._sdk.ViewMode.FULLSCREEN : this._sdk.ViewMode.NORMAL,
      );
    }
  }

  private _onAdsManagerLoaded(adsManagerLoadedEvent: google.ima.AdsManagerLoadedEvent) {
    // Load could occur after a source change (race condition)
    if (!this._getEnabled()) {
      console.log('AdsManagerLoadedEvent ignored');
      return;
    }

    // Get the ads manager
    const settings = new this._sdk!.AdsRenderingSettings();

    // Tell the SDK to save and restore content video state on our behalf
    settings.restoreCustomPlaybackStateOnAdBreakComplete = true;
    if ((this._media.player!.load = 'eager')) {
      settings.enablePreloading = true;
    }

    // Instantiate the AdsManager from the adsLoader response and pass it the video element
    this._adsManager = adsManagerLoadedEvent.getAdsManager(
      this._media.player! as unknown as HTMLVideoElement,
      settings,
    );

    this.$store.adCuePoints.set(this._adsManager.getCuePoints());
    console.log('Cue Points', this.$store.adCuePoints());

    // Add listeners to the required events
    for (const [event, mapping] of Object.entries(this._adEventsToDispatch)) {
      this._addEventListener(this._adsManager, event, (e) => {
        console.log('Dispatching Event', event, mapping);
        this._onAdEvent(e, mapping);
      });
    }

    for (const [event, mapping] of Object.entries(this._adEventHandlerMapping)) {
      console.log('Adding Event Listener', event, mapping);
      this._addEventListener(this._adsManager, event, mapping.bind(this));
    }

    this._addEventListener(
      this._adsManager,
      this._sdk!.AdErrorEvent.Type.AD_ERROR,
      this._onAdsManagerAdError.bind(this),
    );
  }

  private _onAdsManagerAdError(adErrorEvent: google.ima.AdErrorEvent) {
    console.log(adErrorEvent);
    if (this._adsManager) {
      this._adsManager.destroy();
    }
  }

  private _onAdBuffering() {
    this.$store.adBuffering.set(true);
  }

  private _onContentPauseRequested() {
    this._media.remote.pause();
  }

  private _onContentResumeRequested(adEvent: google.ima.AdEvent) {
    if (!this._media.$store.ended()) {
      // only resume if not ended
      this._media.remote.play();
    }
  }

  private _onAdLoaded(adEvent: google.ima.AdEvent) {
    let ad = adEvent.getAd();
    if (ad && !ad.isLinear()) {
      this._media.remote.play();
    }
  }

  private _onAdStart() {
    this.$store.started.set(true);
    this.$store.playing.set(true);
    this.$store.adBuffering.set(false);
  }

  private _onAdComplete() {
    this.$store.started.set(false);
    this.$store.playing.set(false);
  }

  private _onAdProgress() {}

  private _onAdPause() {
    this.$store.playing.set(false);
  }

  private _onAdResume() {
    this.$store.playing.set(true);
  }

  private _onAdCanPlay() {
    this.$store.canPlay.set(true);
  }

  private _onAdMute() {
    this._media.$store.muted.set(true);
  }

  private _onAdVolumeChange() {
    this._media.$store.volume.set(this._adsManager!.getVolume());
  }

  private _onAdEvent(adEvent: google.ima.AdEvent, mapping: keyof AdEvents) {
    this.dispatch(mapping, {
      trigger: adEvent as unknown as Event,
    });
  }
}

export interface AdEvents {
  ad_can_play: AdEvent;
  ad_error: AdEvent;
  ad_buffering: AdEvent;
  ad_progress: AdEvent;
  ad_volume_change: AdEvent;
  ad_complete: AdEvent;
  ad_all_complete: AdEvent;
  ad_clicked: AdEvent;
  ad_break_ready: AdEvent;
  ad_metadata: AdEvent;
  all_ads_completed: AdEvent;
  ad_click: AdEvent;
  content_pause_requested: AdEvent;
  content_resume_requested: AdEvent;
  ad_duration_change: AdEvent;
  ad_first_quartile: AdEvent;
  ad_impression: AdEvent;
  ad_interaction: AdEvent;
  ad_linear_changed: AdEvent;
  ad_loaded: AdEvent;
  ad_log: AdEvent;
  ad_midpoint: AdEvent;
  ad_pause: AdEvent;
  ad_resume: AdEvent;
  ad_skippable_state_changed: AdEvent;
  ad_skip: AdEvent;
  ad_start: AdEvent;
  ad_third_quartile: AdEvent;
  ad_user_close: AdEvent;
  ad_mute: AdEvent;
}

export interface AdEvent extends DOMEvent<void> {
  trigger?: Event;
}

type EventHandlerMapping = Partial<{
  [value in google.ima.AdEvent.Type | 'adCanPlay']: (event: google.ima.AdEvent) => void;
}>;

type EventDispatchMapping = {
  [value in google.ima.AdEvent.Type | 'adCanPlay']: keyof AdEvents;
};
