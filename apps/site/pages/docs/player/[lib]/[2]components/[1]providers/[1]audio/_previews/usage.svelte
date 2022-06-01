<script>
  import { Media, Audio } from '@vidstack/player/svelte';
</script>

<Media>
  <Audio controls>
    <audio
      class="w-72 992:w-80"
      controls
      preload="none"
      src="https://media-files.vidstack.io/audio.mp3"
    />
  </Audio>
</Media>
