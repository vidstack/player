<script>
  import '../../define/vds-audio';
  import {
    MediaControlsAddon,
    MediaEventsAddon,
    mediaStoreAction
  } from '../../media/stories';
  import { spreadPropsAction } from '../../utils/stories';

  let mediaProvider;

  let mediaProps = {
    src: 'https://media-files.vidstack.io/audio.mp3',
    controls: true
  };
</script>

<vds-audio
  bind:this={mediaProvider}
  use:spreadPropsAction={mediaProps}
  use:mediaStoreAction={(newProps) => {
    mediaProps = { ...mediaProps, ...newProps };
  }}
/>

<MediaControlsAddon
  {...mediaProps}
  on:change={({ detail: newProps }) => {
    mediaProps = newProps;
  }}
/>

<MediaEventsAddon {mediaProvider} />

<style>
  vds-audio {
    width: 375px;
  }
</style>
