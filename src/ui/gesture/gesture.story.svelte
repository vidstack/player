<script context="module">
  export const __pageMeta = {
    title: 'GestureElement'
  };
</script>

<script>
  import { GestureElement } from './GestureElement';
  import { MediaUiElement } from '../../media';
  import { safelyDefineCustomElement } from '../../utils/dom';
  import { VideoPlayerElement } from '../../players/video';

  safelyDefineCustomElement('vds-gesture', GestureElement);
  safelyDefineCustomElement('vds-video-player', VideoPlayerElement);
  safelyDefineCustomElement('vds-media-ui', MediaUiElement);
</script>

<vds-video-player
  src="https://media-files.vidstack.io/720p.mp4"
  poster="https://media-files.vidstack.io/poster.png"
>
  <vds-media-ui slot="ui">
    <vds-gesture type="mouseleave" action="pause" />
    <vds-gesture type="click" action="toggle:paused" />
    <vds-gesture
      type="click"
      repeat="1"
      priority="1"
      action="toggle:fullscreen"
    />
    <vds-gesture
      class="seek-gesture left"
      type="click"
      repeat="1"
      priority="0"
      action="seek:-30"
    />
    <vds-gesture
      class="seek-gesture right"
      type="click"
      repeat="1"
      priority="0"
      action="seek:30"
    />
  </vds-media-ui>
</vds-video-player>

<style>
  vds-video-player {
    max-width: 85%;
  }

  vds-gesture {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .seek-gesture {
    width: 25%;
  }

  .seek-gesture.right {
    left: unset;
    right: 0;
  }
</style>
