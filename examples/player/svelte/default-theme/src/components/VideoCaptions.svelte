<media-captions class="vds-captions" />

<style>
  media-captions {
    z-index: 10;
    bottom: 0;
    transition: bottom 0.15s linear;
  }

  /* Pull captions up when controls are visible. */
  :global(media-player[data-controls]) media-captions {
    bottom: 80px;
  }

  /* Hide captions when interacting with time slider. */
  :global(media-player[data-preview]) media-captions {
    opacity: 0;
  }
</style>
