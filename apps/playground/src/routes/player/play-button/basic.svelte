<script>
  import ComponentPreviewLayout from '$lib/layout/ComponentPreviewLayout.svelte';
</script>

<ComponentPreviewLayout>
  <h1 slot="heading">Play Button</h1>

  <p slot="description">
    A simple playback toggle which includes a play and pause icon. Tapping the button will toggle
    the paused state of media.
  </p>

  <vds-play-button>
    <div class="icon-container">
      <svg class="play-icon" aria-hidden="true" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M19.376 12.416L8.777 19.482A.5.5 0 0 1 8 19.066V4.934a.5.5 0 0 1 .777-.416l10.599 7.066a.5.5 0 0 1 0 .832z"
        />
      </svg>
    </div>
    <div class="icon-container">
      <svg class="pause-icon" aria-hidden="true" viewBox="0 0 24 24">
        <path fill="currentColor" d="M6 5h2v14H6V5zm10 0h2v14h-2V5z" />
      </svg>
    </div>
  </vds-play-button>
</ComponentPreviewLayout>

<style global>
  vds-play-button {
    position: relative;
    width: 36px;
    height: 36px;
    border-radius: 4px;
    cursor: pointer;
    color: white;
  }

  vds-play-button:hover {
    background-color: #353535;
  }

  .icon-container {
    display: flex;
    align-items: center;
    justify-content: center;
    /** `absolute` so icons are placed on top of each other. */
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  vds-play-button > svg {
    width: 28px;
    height: 28px;
    opacity: 1;
    transition: opacity ease 150ms;
  }

  .play-icon {
    /* re-center play icon. */
    margin-left: -1px;
  }

  vds-media-ui[media-paused] .pause-icon {
    opacity: 0;
  }

  vds-media-ui:not([media-paused]) .play-icon {
    opacity: 0;
  }
</style>
