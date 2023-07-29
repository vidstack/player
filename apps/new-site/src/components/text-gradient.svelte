<script lang="ts">
  import { isDarkColorScheme } from '../stores/color-scheme';
</script>

<span
  class="text-transparent bg-clip-text bg-gradient-to-r from-[var(--from)] to-[var(--to)]"
  style={$isDarkColorScheme
    ? '--from: oklch(0.7 0.19 47.31); --to: oklch(0.66 0.21 353.93);'
    : '--from: oklch(0.61 0.19 44.84); --to: oklch(0.6 0.2 354.46);'}
>
  <slot />
</span>
