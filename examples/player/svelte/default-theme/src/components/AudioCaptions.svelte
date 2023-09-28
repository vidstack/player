<media-captions class="vds-captions" />

<style>
  media-captions {
    --cue-font-size: 14px;
    display: inline-block;
    position: absolute;
    width: 100%;
    top: unset;
    bottom: calc(100% + 2px);
    text-align: center;
    background-color: transparent;
  }

  media-captions :global([data-part='cue']) {
    color: white;
    border: rgb(255 255 255 / 0.1);
    background-color: black;
  }

  /* Hide captions when interacting with time slider. */
  :global(media-player[data-preview]) media-captions {
    opacity: 0;
  }
</style>
