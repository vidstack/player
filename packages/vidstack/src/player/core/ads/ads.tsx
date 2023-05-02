import { google } from "@alugha/ima";
import { effect } from "maverick.js";
import { Component, defineElement } from "maverick.js/element";
import { DOMEvent, isString } from "maverick.js/std";
import { type MediaContext, useMedia } from "../api/context";
import { ImaSdkLoader } from "./lib-loader";
import { AdsStoreFactory } from "./store";
import type { ImaSdk } from "./types";

enum Type {
  /**
   * Fired when an ad rule or a VMAP ad break would have played if autoPlayAdBreaks is false.
   */
  AD_BREAK_READY = "adBreakReady",
  /**
   * Fired when the ad has stalled playback to buffer.
   */
  AD_BUFFERING = "adBuffering",
  /**
   * Fired when an ads list is loaded.
   */
  AD_METADATA = "adMetadata",
  /**
   * Fired when the ad's current time value changes. Calling getAdData() on this event will return an AdProgressData object.
   */
  AD_PROGRESS = "adProgress",
  /**
   * Fired when the ads manager is done playing all the ads.
   */
  ALL_ADS_COMPLETED = "allAdsCompleted",
  /**
   * Fired when the ad is clicked.
   */
  CLICK = "click",
  /**
   * Fired when the ad completes playing.
   */
  COMPLETE = "complete",
  /**
   * Fired when content should be paused. This usually happens right before an ad is about to cover the content.
   */
  CONTENT_PAUSE_REQUESTED = "contentPauseRequested",
  /**
   * Fired when content should be resumed. This usually happens when an ad finishes or collapses.
   */
  CONTENT_RESUME_REQUESTED = "contentResumeRequested",
  /**
   * Fired when the ad's duration changes.
   */
  DURATION_CHANGE = "durationChange",
  /**
   * Fired when the ad playhead crosses first quartile.
   */
  FIRST_QUARTILE = "firstQuartile",
  /**
   * Fired when the impression URL has been pinged.
   */
  IMPRESSION = "impression",
  /**
   * Fired when an ad triggers the interaction callback. Ad interactions contain an interaction ID string in the ad data.
   */
  INTERACTION = "interaction",
  /**
   * Fired when the displayed ad changes from linear to nonlinear, or vice versa.
   */
  LINEAR_CHANGED = "linearChanged",
  /**
   * Fired when ad data is available.
   */
  LOADED = "loaded",
  /**
   * Fired when a non-fatal error is encountered. The user need not take any action since the SDK will continue with the same or next ad playback depending on the error situation.
   */
  LOG = "log",
  /**
   * Fired when the ad playhead crosses midpoint.
   */
  MIDPOINT = "midpoint",
  /**
   * Fired when the ad is paused.
   */
  PAUSED = "pause",
  /**
   * Fired when the ad is resumed.
   */
  RESUMED = "resume",
  /**
   * Fired when the displayed ads skippable state is changed.
   */
  SKIPPABLE_STATE_CHANGED = "skippableStateChanged",
  /**
   * Fired when the ad is skipped by the user.
   */
  SKIPPED = "skip",
  /**
   * Fired when the ad starts playing.
   */
  STARTED = "start",
  /**
   * Fired when the ad playhead crosses third quartile.
   */
  THIRD_QUARTILE = "thirdQuartile",
  /**
   * Fired when the ad is closed by the user.
   */
  USER_CLOSE = "userClose",
  /**
   * Fired when the ad volume has changed.
   */
  VOLUME_CHANGED = "volumeChange",
  /**
   * Fired when the ad volume has been muted.
   */
  VOLUME_MUTED = "mute",
}

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

  protected _adEventHandlerMapping: EventHandlerMapping  = {
    adBuffering: function (event: google.ima.AdEvent): void {
      throw new Error("Function not implemented.");
    },
    adMetadata: function (event: google.ima.AdEvent): void {
      throw new Error("Function not implemented.");
    },
    allAdsCompleted: function (event: google.ima.AdEvent): void {
      throw new Error("Function not implemented.");
    },
    click: function (event: google.ima.AdEvent): void {
      throw new Error("Function not implemented.");
    },
    durationChange: function (event: google.ima.AdEvent): void {
      throw new Error("Function not implemented.");
    },
    firstQuartile: function (event: google.ima.AdEvent): void {
      throw new Error("Function not implemented.");
    },
    impression: function (event: google.ima.AdEvent): void {
      throw new Error("Function not implemented.");
    },
    interaction: function (event: google.ima.AdEvent): void {
      throw new Error("Function not implemented.");
    },
    linearChanged: function (event: google.ima.AdEvent): void {
      throw new Error("Function not implemented.");
    },
    log: function (event: google.ima.AdEvent): void {
      throw new Error("Function not implemented.");
    },
    midpoint: function (event: google.ima.AdEvent): void {
      throw new Error("Function not implemented.");
    },
    pause: function (event: google.ima.AdEvent): void {
      throw new Error("Function not implemented.");
    },
    resume: function (event: google.ima.AdEvent): void {
      throw new Error("Function not implemented.");
    },
    skippableStateChanged: function (event: google.ima.AdEvent): void {
      throw new Error("Function not implemented.");
    },
    skip: function (event: google.ima.AdEvent): void {
      throw new Error("Function not implemented.");
    },
    start: this._onAdStart,
    thirdQuartile: function (event: google.ima.AdEvent): void {
      throw new Error("Function not implemented.");
    },
    userClose: function (event: google.ima.AdEvent): void {
      throw new Error("Function not implemented.");
    },
    volumeChange: function (event: google.ima.AdEvent): void {
      throw new Error("Function not implemented.");
    },
    mute: function (event: google.ima.AdEvent): void {
      throw new Error("Function not implemented.");
    },
    adBreakReady: function (event: google.ima.AdEvent): void {
      throw new Error("Function not implemented.");
    },
    adProgress: this._onAdProgress,
    complete: this._onAdComplete,
    contentPauseRequested: this._onContentPauseRequested,
    contentResumeRequested: this._onContentResumeRequested,
    loaded: this._onAdLoaded
  }

  protected override onAttach(): void {
    this._media = useMedia();
    console.log('onAttach', this.$store)
    this.setAttributes({
      'data-playing': this.$store.playing,
    })
  }

  protected override onConnect(el: HTMLElement) {
    new ImaSdkLoader(this._libraryUrl, this._media, (imaSdk) => {
      this.setup(imaSdk, el);

      effect(this._watchContentComplete.bind(this));
      effect(this._watchPlay.bind(this));
    })
  }

  protected override onDisconnect() {
    this._adsManager?.destroy();
    this._adsLoader?.destroy();
  }

  protected _getEnabled() {
    return (
      (this._media.$provider()?.type === 'video' || this._media.$provider()?.type === 'hls') &&
      this.$props.enabled() && isString(this.$props.url())
    );
  }


  setup(imaSdk: ImaSdk, adContainer: HTMLElement) {
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

  private loadAds() {
    // Prevent this function from running on if there are already ads loaded
    if (this.$store.loaded()) {
      return;
    }
    this.$store.loaded.set(true);

    console.log("loading ads");

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
    for(const [event, mapping] of Object.entries(this._adEventHandlerMapping)) {
      console.log('Adding Event Listener', event, mapping)
      this._adsManager.addEventListener(
        event,
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
    console.log('Ad Loaded', ad)
    if (ad && !ad.isLinear()) {
      this._media.remote.play()
    }
  }

  private _onAdStart(adEvent: google.ima.AdEvent) {
    this.$store.playing.set(true)
    this.dispatch('ad_started', {
      trigger: adEvent as unknown as Event,
    });
  }

  private _onAdComplete(adEvent: google.ima.AdEvent) {
    this.$store.playing.set(false)
    this.dispatch('ad_complete', {
      trigger: adEvent as unknown as Event,
    });
  }

  private _onAdProgress(adEvent: google.ima.AdEvent) {
    // let ad = adEvent.getAd();
    this.dispatch('ad_progress', {
      trigger: adEvent as unknown as Event,
    });
  }

}

export interface AdsAPI {
  props: AdsProps;
  events: AdsEvents;
  store: typeof AdsStoreFactory;
}

export interface AdsProps {
  enabled: boolean;
  url: string;
  locale: string | null;
}

export interface AdsEvents {
  'ad_can_play': AdCanPlayEvent;
  'ad_started': AdStartedEvent;
  'ad_paused': AdPausedEvent;
  'ad_resumed': AdResumedEvent;
  'ad_skipped': AdSkippedEvent;
  'ad_error': AdErrorEvent;
  'ad_buffering': AdBufferingEvent;
  'ad_progress': AdProgressEvent;
  'ad_volume_change': AdVolumeChangeEvent;
  'ad_complete': AdCompleteEvent;
  'ad_all_complete': AdAllCompleteEvent;
  'ad_clicked': AdClickedEvent;
}

export interface AdCanPlayEvent extends DOMEvent<void> {
  /** The `canplay` media event. */
  trigger?: Event;
}

export interface AdStartedEvent extends DOMEvent<void> {
  /** The `canplay` media event. */
  trigger?: Event;
}

export interface AdPausedEvent extends DOMEvent<void> {
  /** The `canplay` media event. */
  trigger?: Event;
}

export interface AdResumedEvent extends DOMEvent<void> {
  /** The `canplay` media event. */
  trigger?: Event;
}

export interface AdSkippedEvent extends DOMEvent<void> {
  /** The `canplay` media event. */
  trigger?: Event;
}

export interface AdErrorEvent extends DOMEvent<void> {
  /** The `canplay` media event. */
  trigger?: Event;
}

export interface AdBufferingEvent extends DOMEvent<void> {
  /** The `canplay` media event. */
  trigger?: Event;
}

export interface AdProgressEvent extends DOMEvent<void> {
  trigger?: Event;
}

export interface AdVolumeChangeEvent extends DOMEvent<void> {
  /** The `canplay` media event. */
  trigger?: Event;
}

export interface AdCompleteEvent extends DOMEvent<void> {
  /** The `canplay` media event. */
  trigger?: Event;
}

export interface AdAllCompleteEvent extends DOMEvent<void> {
  /** The `canplay` media event. */
  trigger?: Event;
}

export interface AdClickedEvent extends DOMEvent<void> {
  /** The `canplay` media event. */
  trigger?: Event;
}

type EventHandlerMapping = {
  [key in google.ima.AdEvent.Type]: (event: google.ima.AdEvent) => void;
};