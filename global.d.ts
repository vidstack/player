declare global {
  type WebKitPresentationMode = 'picture-in-picture' | 'inline' | 'fullscreen';

  type FullscreenEvents = import('./types').FullscreenEvents;
  type HlsEvents = import('./types').HlsEvents;
  type MediaEvents = import('./types').MediaEvents;
  type MediaRequestEvents = import('./types').MediaRequestEvents;
  type ScreenOrientationEvents = import('./types').ScreenOrientationEvents;
  type ScrubberPreviewEvents = import('./types').ScrubberPreviewEvents;
  type SliderEvents = import('./types').SliderEvents;
  type VideoPresentationEvents = import('./types').VideoPresentationEvents;
  type LoggerEvents = import('./types').LoggerEvents;

  interface GlobalEventHandlersEventMap
    extends FullscreenEvents,
      HlsEvents,
      MediaEvents,
      MediaRequestEvents,
      ScreenOrientationEvents,
      ScrubberPreviewEvents,
      SliderEvents,
      VideoPresentationEvents,
      LoggerEvents {
    'vds-media-player-connect': import('./types').MediaPlayerConnectEvent;
    'vds-media-controller-connect': import('./types').MediaControllerConnectEvent;
    'vds-media-provider-connect': import('./types').MediaProviderConnectEvent;
    'vds-scrubber-preview-connect': import('./types').ScrubberPreviewConnectEvent;
  }
}

export {};
