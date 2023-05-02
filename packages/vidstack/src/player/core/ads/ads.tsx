import { google } from "@alugha/ima";
import { effect, computed } from "maverick.js";
import { Component, defineElement } from "maverick.js/element";
import { DOMEvent, isString } from "maverick.js/std";
import { type MediaContext, useMedia } from "../api/context";
import { ImaSdkLoader } from "./lib-loader";
import { AdsStoreFactory } from "./store";
import type { ImaSdk } from "./types";

export class Ads extends Component<AdsAPI> {

  static el = defineElement<AdsAPI>({
    tagName: 'media-ads',
    props: { enabled: false, url: '', locale: '' },
    store: AdsStoreFactory,
  });

  _media!: MediaContext;

  protected _libraryUrl: string = '//imasdk.googleapis.com/js/sdkloader/ima3.js';
  protected _sdk: typeof google.ima | null = null;
  protected _adDisplayContainer: google.ima.AdDisplayContainer | null = null;
  protected _adsLoader: google.ima.AdsLoader | null = null;
  protected _adsRequest: google.ima.AdsRequest | null = null;
  protected _adsManager: google.ima.AdsManager | null = null;

  protected _adEventsToDispatch: EventDispatchMapping = {
    adBreakReady: "ad_break_ready",
    adBuffering: "ad_buffering",
    adMetadata: "ad_metadata",
    adProgress: "ad_progress",
    allAdsCompleted: "ad_all_complete",
    click: "ad_click",
    complete: "ad_complete",
    contentPauseRequested: "content_pause_requested",
    contentResumeRequested: "content_resume_requested",
    durationChange: "ad_duration_change",
    firstQuartile: "ad_first_quartile",
    impression: "ad_impression",
    interaction: "ad_interaction",
    linearChanged: "ad_linear_changed",
    loaded: "ad_loaded",
    log: "ad_log",
    midpoint: "ad_midpoint",
    pause: "ad_pause",
    resume: "ad_resume",
    skippableStateChanged: "ad_skippable_state_changed",
    skip: "ad_skip",
    start: "ad_start",
    thirdQuartile: "ad_third_quartile",
    userClose: "ad_user_close",
    volumeChange: "ad_volume_change",
    mute: "ad_mute",
    adCanPlay: "ad_can_play"
  }

  protected _adEventHandlerMapping: EventHandlerMapping  = {
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
    adCanPlay: this._onAdCanPlay
  }

  protected override onAttach(): void {
    this._media = useMedia();
    console.log('onAttach', this.$store)
    this.setAttributes({
      'data-paused': computed(() => !this.$store.playing() && !this.$store.started()) ,
      'data-playing': this.$store.playing,
      'data-buffering': this.$store.buffering,
      'data-can-play': this.$store.canPlay,
      'data-started': this.$store.started,
    })
  }

  protected override onConnect(el: HTMLElement) {
    new ImaSdkLoader(this._libraryUrl, this._media, (imaSdk) => {
      this.setup(imaSdk, el);

      effect(this._watchContentComplete.bind(this));
      effect(this._watchPlay.bind(this));
    })
  }

  protected setup(imaSdk: ImaSdk, adContainer: HTMLElement) {
    this._sdk = imaSdk;
    this._sdk.settings.setDisableCustomPlaybackForIOS10Plus(true)
    this._sdk.settings.setVpaidMode(this._sdk.ImaSdkSettings.VpaidMode.ENABLED);
    let locale = this.$props.locale();
    if (locale && isString(locale) && locale.length > 0) {
      this._sdk.settings.setLocale(locale!)
    }

    this._adDisplayContainer = new imaSdk.AdDisplayContainer(adContainer, this._media.player! as unknown as HTMLVideoElement);
    this._adsLoader = new imaSdk.AdsLoader(this._adDisplayContainer);

    this._adsLoader.addEventListener(this._sdk.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, this._onAdsManagerLoaded.bind(this), false);
    this._adsLoader.addEventListener(this._sdk.AdErrorEvent.Type.AD_ERROR, this._onAdsManagerAdError.bind(this), false);
    window.addEventListener('resize', this._onResized.bind(this));

    this._adsRequest = new this._sdk.AdsRequest();
    this._adsRequest.adTagUrl = this.$props.url();

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
    this._adsManager?.destroy();
    this._adsLoader?.destroy();
  }


  private loadAds() {
    // Prevent this function from running on if there are already ads loaded
    if (this.$store.loaded()) {
      return;
    }
    this.$store.loaded.set(true);

    this._adDisplayContainer?.initialize()

    var width = this._media.player!.clientWidth;
    var height = this._media.player!.clientHeight;
    try {
      this._adsManager!.init(width, height, this._sdk!.ViewMode.NORMAL);
      this._adsManager!.start();
    } catch (adError) {
      // Play the video without ads, if an error occurs
      console.log("AdsManager could not be started", adError);
    }
  }

  protected _getEnabled() {
    return (
      (this._media.$provider()?.type === 'video' || this._media.$provider()?.type === 'hls') &&
      this.$props.enabled() && isString(this.$props.url())
    );
  }

  private _onResized() {
    if (this._adsManager) {
      this._adsManager.resize(this._media.player!.clientWidth, this._media.player!.clientHeight, this._sdk!.ViewMode.NORMAL);
    }
  }

  private _watchContentComplete() {
    let { ended } = this._media.$store;
    if (ended() && this._adsLoader) {
      this._adsLoader.contentComplete();
    }
  }

  private _watchPlay() {
    let { playing } = this._media.$store;
    if (playing()) {
      this.loadAds();
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
    settings.enablePreloading = true;

    // Instantiate the AdsManager from the adsLoader response and pass it the video element
    this._adsManager = adsManagerLoadedEvent.getAdsManager(
      this._media.player! as unknown as HTMLVideoElement,
      // settings
    );

    this.$store.cuePoints.set(this._adsManager.getCuePoints());
    console.log('Cue Points', this.$store.cuePoints())

    // Add listeners to the required events
    for(const [event, mapping] of Object.entries(this._adEventsToDispatch)) {
      this._adsManager.addEventListener(
        event as google.ima.AdEvent.Type,
        (e) => {
          this._onAdEvent(e, mapping)
        },
      );
    }

    for(const [event, mapping] of Object.entries(this._adEventHandlerMapping)) {
      console.log('Adding Event Listener', event, mapping)
      this._adsManager.addEventListener(
        event as google.ima.AdEvent.Type,
        mapping.bind(this),
      );
    }
    
    this._adsManager.addEventListener(
      this._sdk!.AdErrorEvent.Type.AD_ERROR,
      this._onAdsManagerAdError.bind(this),
    );
  }

  private _onAdsManagerAdError(adErrorEvent: google.ima.AdErrorEvent) {
    console.log(adErrorEvent)
    if (this._adsManager) {
      this._adsManager.destroy();
    }
  }

  private _onAdBuffering() {
    this.$store.buffering.set(true);
  }

  private _onContentPauseRequested() {
    this._media.remote.pause();
  }

  private _onContentResumeRequested(adEvent: google.ima.AdEvent) {
    if (!this._media.$store.ended()) { // only resume if not ended
      this._media.remote.play();
    }
  }

  private _onAdLoaded(adEvent: google.ima.AdEvent) {
    let ad = adEvent.getAd();
    if (ad && !ad.isLinear()) {
      this._media.remote.play()
    }
  }

  private _onAdStart() {
    this.$store.started.set(true);
    this.$store.playing.set(true);
    this.$store.buffering.set(false);
  }

  private _onAdComplete() {
    this.$store.started.set(false);
    this.$store.playing.set(false);
  }

  private _onAdProgress() {

  }

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
    console.log('Dispatching event', mapping, adEvent)
    this.dispatch(mapping, {
      trigger: adEvent as unknown as Event,
    });
  }

}

export interface AdsAPI {
  props: AdsProps;
  events: AdEvents;
  store: typeof AdsStoreFactory;
}

export interface AdsProps {
  enabled: boolean;
  url: string;
  locale: string | null;
}

export interface AdEvents {
  'ad_can_play': AdEvent;
  'ad_error': AdEvent;
  'ad_buffering': AdEvent;
  'ad_progress': AdEvent;
  'ad_volume_change': AdEvent;
  'ad_complete': AdEvent;
  'ad_all_complete': AdEvent;
  'ad_clicked': AdEvent;
  'ad_break_ready': AdEvent,
  'ad_metadata': AdEvent,
  'all_ads_completed': AdEvent,
  'ad_click': AdEvent,
  'content_pause_requested': AdEvent,
  'content_resume_requested': AdEvent,
  'ad_duration_change': AdEvent,
  'ad_first_quartile': AdEvent,
  'ad_impression': AdEvent,
  'ad_interaction': AdEvent,
  'ad_linear_changed': AdEvent,
  'ad_loaded': AdEvent,
  'ad_log': AdEvent,
  'ad_midpoint': AdEvent,
  'ad_pause': AdEvent,
  'ad_resume': AdEvent,
  'ad_skippable_state_changed': AdEvent,
  'ad_skip': AdEvent,
  'ad_start': AdEvent,
  'ad_third_quartile': AdEvent,
  'ad_user_close': AdEvent,
  'ad_mute': AdEvent,
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