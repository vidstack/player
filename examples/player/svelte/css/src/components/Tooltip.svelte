<script lang="ts">
  import type { TooltipPlacement } from 'vidstack';

  export let placement: TooltipPlacement;
</script>

<media-tooltip>
  <media-tooltip-trigger>
    <slot name="trigger" />
  </media-tooltip-trigger>
  <media-tooltip-content class="tooltip" {placement}>
    <slot name="content" />
  </media-tooltip-content>
</media-tooltip>

<style lang="postcss">
  .tooltip {
    --enter-transform: translateY(0px) scale(1);
    --exit-transform: translateY(12px) scale(0.8);

    display: inline-block;
    color: hsl(0, 0%, 80%);
    background-color: black;
    font-size: 13px;
    font-weight: 500;
    opacity: 0;
    pointer-events: none;
    white-space: nowrap;
    z-index: 10;
    border-radius: 2px;
    padding: 2px 8px;
    will-change: transform, opacity;

    &[data-visible] {
      animation: media-tooltip-enter 0.2s ease-in;
      animation-fill-mode: forwards;
    }

    &:not([data-visible]) {
      animation: media-tooltip-exit 0.2s ease-out;
    }

    &[data-placement~='bottom'] {
      --exit-transform: translateY(-12px) scale(0.8);
    }
  }

  @keyframes -global-media-tooltip-enter {
    from {
      opacity: 0;
      transform: var(--exit-transform);
    }
    to {
      opacity: 1;
      transform: var(--enter-transform);
    }
  }

  @keyframes -global-media-tooltip-exit {
    from {
      opacity: 1;
      transform: var(--enter-transform);
    }
    to {
      opacity: 0;
      transform: var(--exit-transform);
    }
  }

  :global(media-menu[data-open]) .tooltip {
    display: none !important;
  }
</style>
