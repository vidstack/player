import airplay from 'media-icons/dist/icons/airplay.js';
import arrowDown from 'media-icons/dist/icons/arrow-down.js';
import menuArrowLeft from 'media-icons/dist/icons/arrow-left.js';
import arrowUp from 'media-icons/dist/icons/arrow-up.js';
import chapters from 'media-icons/dist/icons/chapters.js';
import menuArrowRight from 'media-icons/dist/icons/chevron-right.js';
import googleCast from 'media-icons/dist/icons/chromecast.js';
import ccOn from 'media-icons/dist/icons/closed-captions-on.js';
import ccOff from 'media-icons/dist/icons/closed-captions.js';
import menuCaptions from 'media-icons/dist/icons/closed-captions.js';
import fastBackward from 'media-icons/dist/icons/fast-backward.js';
import fastForward from 'media-icons/dist/icons/fast-forward.js';
import fsExit from 'media-icons/dist/icons/fullscreen-exit.js';
import fsEnter from 'media-icons/dist/icons/fullscreen.js';
import menuAudio from 'media-icons/dist/icons/music.js';
import mute from 'media-icons/dist/icons/mute.js';
import pause from 'media-icons/dist/icons/pause.js';
import pipExit from 'media-icons/dist/icons/picture-in-picture-exit.js';
import pipEnter from 'media-icons/dist/icons/picture-in-picture.js';
import play from 'media-icons/dist/icons/play.js';
import menuPlayback from 'media-icons/dist/icons/playback-speed-circle.js';
import replay from 'media-icons/dist/icons/replay.js';
import seekBackward from 'media-icons/dist/icons/seek-backward-10.js';
import seekForward from 'media-icons/dist/icons/seek-forward-10.js';
import settings from 'media-icons/dist/icons/settings.js';
import volumeHigh from 'media-icons/dist/icons/volume-high.js';
import volumeLow from 'media-icons/dist/icons/volume-low.js';

const menuAccessibility = `<path d="M16 8c-.733 0-1.36-.261-1.883-.783a2.573 2.573 0 0 1-.784-1.884c0-.733.262-1.36.784-1.883A2.575 2.575 0 0 1 16 2.667a2.57 2.57 0 0 1 1.884.784c.523.523.784 1.15.783 1.883 0 .733-.261 1.361-.783 1.884A2.561 2.561 0 0 1 16 8Zm-4 20V12H5.333c-.377 0-.694-.128-.949-.384a1.296 1.296 0 0 1-.384-.95c0-.377.128-.694.384-.949s.572-.383.95-.384h21.333c.377 0 .694.128.95.384s.384.573.383.95c0 .377-.128.694-.384.95a1.285 1.285 0 0 1-.95.383H20v16c0 .378-.128.695-.384.95a1.285 1.285 0 0 1-.95.383c-.377 0-.694-.128-.949-.384a1.297 1.297 0 0 1-.384-.95v-6.666h-2.666V28c0 .378-.128.695-.384.95a1.285 1.285 0 0 1-.95.383c-.377 0-.694-.128-.949-.384A1.297 1.297 0 0 1 12 28Z" fill="currentColor"/>`,
  menuRadioCheck = `<path d="M26.8838 8.98969L25.0856 7.12371C25.0141 7.04124 24.9018 7 24.7996 7C24.6872 7 24.585 7.04124 24.5135 7.12371L12.0494 19.7938L7.51326 15.2165C7.43153 15.134 7.32936 15.0928 7.2272 15.0928C7.12503 15.0928 7.02287 15.134 6.94113 15.2165L5.1226 17.0515C4.95913 17.2165 4.95913 17.4742 5.1226 17.6392L10.8438 23.4124C11.2116 23.7835 11.6612 24 12.0392 24C12.5806 24 13.0506 23.5979 13.2243 23.433H13.2345L26.894 9.57732C27.037 9.40206 27.037 9.14433 26.8838 8.98969Z" fill="currentColor"/>`;

export const icons = {
  airplay,
  play,
  pause,
  replay,
  mute,
  'google-cast': googleCast,
  'volume-low': volumeLow,
  'volume-high': volumeHigh,
  'cc-on': ccOn,
  'cc-off': ccOff,
  'pip-enter': pipEnter,
  'pip-exit': pipExit,
  'fs-enter': fsEnter,
  'fs-exit': fsExit,
  'seek-forward': seekForward,
  'seek-backward': seekBackward,
  'menu-chapters': chapters,
  'menu-settings': settings,
  'menu-arrow-left': menuArrowLeft,
  'menu-arrow-right': menuArrowRight,
  'menu-accessibility': menuAccessibility,
  'menu-audio': menuAudio,
  'menu-audio-boost-up': volumeHigh,
  'menu-audio-boost-down': volumeLow,
  'menu-playback': menuPlayback,
  'menu-speed-up': fastForward,
  'menu-speed-down': fastBackward,
  'menu-captions': menuCaptions,
  'menu-quality-up': arrowUp,
  'menu-quality-down': arrowDown,
  'menu-radio-check': menuRadioCheck,
  'kb-play': play,
  'kb-pause': pause,
  'kb-mute': mute,
  'kb-volume-up': volumeHigh,
  'kb-volume-down': volumeLow,
  'kb-fs-enter': fsEnter,
  'kb-fs-exit': fsExit,
  'kb-pip-enter': pipEnter,
  'kb-pip-exit': pipExit,
  'kb-cc-on': ccOn,
  'kb-cc-off': ccOff,
  'kb-seek-forward': fastForward,
  'kb-seek-backward': fastBackward,
};
