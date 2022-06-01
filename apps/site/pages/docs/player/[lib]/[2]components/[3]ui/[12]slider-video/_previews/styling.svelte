<script>
  import '../_snippets/styling.css';

  import {
    AspectRatio,
    Gesture,
    Media,
    SliderValueText,
    SliderVideo,
    TimeSlider,
    Video,
  } from '@vidstack/player/svelte';
</script>

<Media class="w-full max-w-md">
  <AspectRatio ratio="16/9">
    <Video autoplay muted>
      <video preload="none" src="https://media-files.vidstack.io/360p.mp4">
        <track kind="captions" />
      </video>
    </Video>
  </AspectRatio>

  <div class="media-controls">
    <TimeSlider>
      <div class="slider-track" />
      <div class="slider-track fill" />
      <div class="slider-thumb-container">
        <div class="slider-thumb" />
      </div>

      <div class="media-preview-container">
        <SliderVideo src="https://media-files.vidstack.io/240p.mp4" />
        <SliderValueText type="pointer" format="time" />
      </div>
    </TimeSlider>
  </div>

  <Gesture class="absolute top-0 left-0 w-full h-full" action="toggle:paused" type="click" />
</Media>
