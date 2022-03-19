<script>
  import '@vidstack/player/define/dangerously-all.js';
</script>

<div class="mt-8 w-full">
  <div class="w-full">
    <span class="font-mono text-sm">Component</span>
    <vds-video-player
      class="relative bg-transparent"
      loading="eager"
      src="https://media-files.vidstack.io/720p.mp4"
      poster="https://media-files.vidstack.io/poster.png"
    >
      <vds-media-ui class="absolute top-0 left-0" slot="ui">
        <div
          class="border-gray-divider 992:p-20 relative mt-3 flex w-full items-center justify-center border p-16"
          style={`background-color: var(--component-preview-bg, #212121);`}
        >
          <div class="component-preview">
            <slot />
          </div>
        </div>
      </vds-media-ui>
    </vds-video-player>
  </div>
</div>

<style>
  vds-video-player {
    width: 100%;
  }

  vds-video-player::part(media) {
    width: 100%;
    height: auto;
    margin-top: 12rem;
    aspect-ratio: 16 / 9;
    background: #212121;
  }

  @media only screen and (min-width: 992px) {
    vds-video-player::part(media) {
      margin-top: 14rem;
    }
  }

  vds-media-ui {
    width: 100%;
    aspect-ratio: 16 / 9;
  }

  vds-media-ui:not([media-can-play]) .component-preview {
    opacity: 0;
  }
</style>
