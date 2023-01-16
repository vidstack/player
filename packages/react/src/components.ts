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

* @docs {@link https://www.vidstack./io/docs/react/player/components/media/media}
* @example
*```tsx
*<Media>
*  <Video>
*    <video src="..." />
*  </Video>
*
*  Other components that use/manage media state here.
*</Media>
*```
*/
export const Media = createLiteReactElement(MediaDefinition);

/**
The `<vds-audio>` component adapts the slotted `<audio>` element to satisfy the media provider
contract, which generally involves providing a consistent API for loading, managing, and
tracking media state.

* @docs {@link https://www.vidstack./io/docs/react/player/components/providers/audio}
* @example
*```tsx
*<Audio>
*  <audio
*    controls
*    preload="none"
*    src="https://media-files.vidstack.io/audio.mp3"
*   ></audio>
*</Audio>
*```
* @example
*```tsx
*<Audio>
*  <audio controls preload="none">
*    <source src="https://media-files.vidstack.io/audio.mp3" type="audio/mp3" />
*  </audio>
*</Audio>
*```
*/
export const Audio = createLiteReactElement(AudioDefinition);

/**
The `<vds-hls-video>` component introduces support for HLS streaming via the popular `hls.js`
library. HLS streaming is either [supported natively](https://caniuse.com/?search=hls) (generally
on iOS), or in environments that [support the Media Stream API](https://caniuse.com/?search=mediastream).

Do note, `hls.js` is only loaded when needed and supported.

💡 This element can attach `hls.js` events so you can listen to them through the native DOM
interface (i.e., el.addEventListener(`hls-media-attaching`)).

* @docs {@link https://www.vidstack./io/docs/react/player/components/providers/hls-video}
* @example
*```tsx
*<HlsVideo  poster="https://media-files.vidstack.io/poster.png">
*  <video
*    preload="none"
*    src="https://media-files.vidstack.io/hls/index.m3u8"
*  ></video>
*</HlsVideo>
*```
* @example
*```tsx
*<HlsVideo poster="https://media-files.vidstack.io/poster.png">
*  <video preload="none">
*    <source
*      src="https://media-files.vidstack.io/hls/index.m3u8"
*      type="application/x-mpegURL"
*    />
*    <track
*      default
*      kind="subtitles"
*      srclang="en"
*      label="English"
*      src="https://media-files.vidstack.io/subs/english.vtt"
*    />
*  </video>
*</HlsVideo>
*```
*/
export const HLSVideo = createLiteReactElement(HLSVideoDefinition);

/**
The `<vds-video>` component adapts the slotted `<video>` element to satisfy the media provider
contract, which generally involves providing a consistent API for loading, managing, and
tracking media state.

* @docs {@link https://www.vidstack./io/docs/react/player/components/providers/video}
* @example
*```tsx
*<Video poster="https://media-files.vidstack.io/poster.png">
*  <video
*    preload="none"
*    src="https://media-files.vidstack.io/720p.mp4"
*  ></video>
*</Video>
*```
* @example
*```tsx
*<Video poster="https://media-files.vidstack.io/poster.png">
*  <video preload="none">
*    <source
*      src="https://media-files.vidstack.io/720p.mp4"
*      type="video/mp4"
*    />
*    <track
*      default
*      kind="subtitles"
*      srclang="en"
*      label="English"
*      src="https://media-files.vidstack.io/subs/english.vtt"
*    />
*  </video>
*</Video>
*```
*/
export const Video = createLiteReactElement(VideoDefinition);

/**
The `<vds-aspect-ratio>` component creates a container that will hold the dimensions of the
desired aspect ratio. This container is useful for reserving space for media as it loads over
the network.

💡  If your browser matrix supports the
[`aspect-ratio`](https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio) CSS property
then you can skip using this component, and set the desired aspect ratio directly on the
provider element.

💡 By default it respects the browser's default aspect-ratio for media. This is not specific
to the loaded media but instead a general setting of `2/1`.

* @docs {@link https://www.vidstack./io/docs/react/player/components/ui/aspect-ratio}
* @example
*```tsx
*<AspectRatio ratio="16/9">
*  <Video>
*    ...
*  </Video>
*</AspectRatio>
*```
*/
export const AspectRatio = createLiteReactElement(AspectRatioDefinition);

/**
A button for toggling the fullscreen mode of the player.

* @docs {@link https://www.vidstack./io/docs/react/player/components/ui/fullscreen-button}
* @example
*```tsx
*<FullscreenButton></FullscreenButton>
*```
*/
export const FullscreenButton = createLiteReactElement(FullscreenButtonDefinition);

/**
A button for toggling the muted state of the player.

* @docs {@link https://www.vidstack./io/docs/react/player/components/ui/mute-button}
* @example
*```tsx
*<MuteButton></MuteButton>
*```
*/
export const MuteButton = createLiteReactElement(MuteButtonDefinition);

/**
A button for toggling the playback state (play/pause) of the current media.

* @docs {@link https://www.vidstack./io/docs/react/player/components/ui/play-button}
* @example
*```tsx
*<PlayButton></PlayButton>
*```
*/
export const PlayButton = createLiteReactElement(PlayButtonDefinition);

/**
Loads and displays the current media poster image. By default, the media provider's
loading strategy is respected meaning the poster won't load until the media can.

* @docs {@link https://www.vidstack./io/docs/react/player/components/ui/poster}
* @example
*```tsx
*<Media>
*  <Poster alt="Large alien ship hovering over New York."></Poster>
*</Media>
*```
*/
export const Poster = createLiteReactElement(PosterDefinition);

/**
Outputs the current slider value as text.

* @docs {@link https://www.vidstack./io/docs/react/player/components/ui/slider-value-text}
* @example
*```tsx
*<TimeSlider>
*  <SliderValueText
*    type="pointer"
*    format="time"
*    slot="preview"
*  ></SliderValueText>
*</TimeSlider>
*```
* @example
*```tsx
*<SliderValueText
*  type="current"
*></SliderValueText>
*```
* @example
*```tsx
*<SliderValueText
*  format="time"
*  show-hours
*  pad-hours
*></SliderValueText>
*```
* @example
*```tsx
*<SliderValueText
*  format="percent"
*  decimal-places="2"
*></SliderValueText>
*```
*/
export const SliderValueText = createLiteReactElement(SliderValueTextDefinition);

/**
Used to load a low-resolution video to be displayed when the user is hovering or dragging
the slider. The point at which they're hovering or dragging (`pointerValue`) is the preview
time position. The video will automatically be updated to match, so ensure it's of the same
length as the original.

* @docs {@link https://www.vidstack./io/docs/react/player/components/ui/slider-video}
* @example
*```tsx
*<TimeSlider>
*  <SliderVideo src="/low-res-video.mp4" slot="preview"></SliderVideo>
*</TimeSlider>
*```
*/
export const SliderVideo = createLiteReactElement(SliderVideoDefinition);

/**
A slider control that lets the user specify their desired time level.

* @docs {@link https://www.vidstack./io/docs/react/player/components/ui/time-slider}
* @example
*```tsx
*<TimeSlider></TimeSlider>
*```
* @example
*```tsx
*<TimeSlider>
*  <SliderValueText
*    type="pointer"
*    format="time"
*    slot="preview"
*  ></SliderValueText>
*</TimeSlider>
*```
*/
export const TimeSlider = createLiteReactElement(TimeSliderDefinition);

/**
Outputs a media duration (eg: `currentTime`, `duration`, `bufferedAmount`, etc.) value as time
formatted text.

* @docs {@link https://www.vidstack./io/docs/react/player/components/ui/time}
* @example
*```tsx
*<Time type="current"></Time>
*```
* @example
*```tsx
*Remaining time.
*<Time type="current" remainder></Time>
*```
*/
export const Time = createLiteReactElement(TimeDefinition);

/**
A slider control that lets the user specify their desired volume level.

* @docs {@link https://www.vidstack./io/docs/react/player/components/ui/volume-slider}
* @example
*```tsx
*<VolumeSlider></VolumeSlider>
*```
* @example
*```tsx
*<VolumeSlider>
*  <SliderValueText
*    type="pointer"
*    format="percent"
*    slot="preview"
*  ></SliderValueText>
*</VolumeSlider>
*```
*/
export const VolumeSlider = createLiteReactElement(VolumeSliderDefinition);
