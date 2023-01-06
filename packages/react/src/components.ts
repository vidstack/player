// !!!!!!!!!!!!!!!!! DO NOT EDIT! This file is auto-generated. !!!!!!!!!!!!!!!!!
import { createLiteReactElement } from 'maverick.js/react';
import {
  AspectRatioDefinition,
  AudioDefinition,
  FullscreenButtonDefinition,
  HLSVideoDefinition,
  MediaDefinition,
  MuteButtonDefinition,
  PlayButtonDefinition,
  PosterDefinition,
  SliderValueTextDefinition,
  SliderVideoDefinition,
  TimeDefinition,
  TimeSliderDefinition,
  VideoDefinition,
  VolumeSliderDefinition,
} from 'vidstack';

/**
All media elements exist inside the `<vds-media>` component. It's main jobs are to host the
media controller, and expose media state through HTML attributes and CSS properties for styling
purposes.

@see {@link https://www.vidstack.io/docs/player/react/components/media/media}
*/
export const Media = createLiteReactElement(MediaDefinition);

/**
The `<vds-audio>` element adapts the underlying `<audio>` element to satisfy the media provider
contract, which generally involves providing a consistent API for loading, managing, and
tracking media state.

@see {@link https://www.vidstack.io/docs/player/react/components/providers/audio}
*/
export const Audio = createLiteReactElement(AudioDefinition);

/**
The `<vds-hls-video>` element adapts the underlying `<video>` element to satisfy the media
provider interface, which generally involves providing a consistent API for loading, managing,
and tracking media state.

This element also introduces support for HLS streaming via the popular `hls.js` library.
HLS streaming is either [supported natively](https://caniuse.com/?search=hls) (generally
on iOS), or in environments that [support the Media Stream API](https://caniuse.com/?search=mediastream).

Do note, `hls.js` is only loaded when needed and supported.

💡 This element can attach `hls.js` events so you can listen to them through the native DOM
interface (i.e., .addEventListener(`hls-media-attaching`)).

@see {@link https://www.vidstack.io/docs/player/react/components/providers/hls-video}
*/
export const HLSVideo = createLiteReactElement(HLSVideoDefinition);

/**
The `<vds-video>` element adapts the underlying `<video>` element to satisfy the media provider
contract, which generally involves providing a consistent API for loading, managing, and
tracking media state.

@see {@link https://www.vidstack.io/docs/player/react/components/providers/video}
*/
export const Video = createLiteReactElement(VideoDefinition);

/**
This element creates a container that will hold the dimensions of the desired aspect ratio. This
container is useful for reserving space for media as it loads over the network.

💡  If your browser matrix supports the
[`aspect-ratio`](https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio) CSS property
then you can skip using this component, and set the desired aspect ratio directly on the
provider element.

💡 By default it respects the browser's default aspect-ratio for media. This is not specific
to the loaded media but instead a general setting of `2/1`.

@see {@link https://www.vidstack.io/docs/player/react/components/ui/aspect-ratio}
*/
export const AspectRatio = createLiteReactElement(AspectRatioDefinition);

/**
A button for toggling the fullscreen mode of the player.

💡 The following attributes are applied:

- `fullscreen`: Applied when the media has entered fullscreen.

🚨 The `hidden` attribute will be present on this element in the event fullscreen cannot be
requested (no support). There are default styles for this by setting the `display` property to
`none`. Important to be aware of this and update it according to your needs.

@see {@link https://www.vidstack.io/docs/player/react/components/ui/fullscreen-button}
*/
export const FullscreenButton = createLiteReactElement(FullscreenButtonDefinition);

/**
A button for toggling the muted state of the player.

💡 The following attributes are applied:

- `muted`: Applied when media audio has been muted.

@see {@link https://www.vidstack.io/docs/player/react/components/ui/mute-button}
*/
export const MuteButton = createLiteReactElement(MuteButtonDefinition);

/**
A button for toggling the playback state (play/pause) of the current media.

💡 The following attributes are applied:

- `paused`: Applied when media playback has paused.

@see {@link https://www.vidstack.io/docs/player/react/components/ui/play-button}
*/
export const PlayButton = createLiteReactElement(PlayButtonDefinition);

/**
Loads and displays the current media poster image. By default, the media provider's
loading strategy is respected meaning the poster won't load until the media can.

💡 The following img attributes are applied:

- `img-loading`: When the poster image is in the process of being downloaded by the browser.
- `img-loaded`: When the poster image has successfully loaded.
- `img-error`: When the poster image has failed to load.

@see {@link https://www.vidstack.io/docs/player/react/components/ui/poster}
*/
export const Poster = createLiteReactElement(PosterDefinition);

/**
Outputs the current slider value as text.

@see {@link https://www.vidstack.io/docs/player/react/components/ui/slider-value-text}
*/
export const SliderValueText = createLiteReactElement(SliderValueTextDefinition);

/**
Used to load a low-resolution video to be displayed when the user is hovering or dragging
the slider. The point at which they're hovering or dragging (`pointerValue`) is the preview
time position. The video will automatically be updated to match, so ensure it's of the same
length as the original.

💡 The following attributes are updated for your styling needs:

- `can-play`: Applied when the video is ready for playback.
- `error`: Applied when a media error has been encountered.

💡 The `canplay` and `error` events are re-dispatched by this element for you to listen to if
needed.

@see {@link https://www.vidstack.io/docs/player/react/components/ui/slider-video}
*/
export const SliderVideo = createLiteReactElement(SliderVideoDefinition);

/**
A slider control that lets the user specify their desired time level.

@see {@link https://www.vidstack.io/docs/player/react/components/ui/time-slider}
*/
export const TimeSlider = createLiteReactElement(TimeSliderDefinition);

/**
Outputs a media duration (eg: `currentTime`, `duration`, `bufferedAmount`, etc.) value as time
formatted text.

@see {@link https://www.vidstack.io/docs/player/react/components/ui/time}
*/
export const Time = createLiteReactElement(TimeDefinition);

/**
A slider control that lets the user specify their desired volume level.

@see {@link https://www.vidstack.io/docs/player/react/components/ui/volume-slider}
*/
export const VolumeSlider = createLiteReactElement(VolumeSliderDefinition);
