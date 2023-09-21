<script lang="ts">
  export let label: string;
</script>

<media-menu-button class="vds-menu-button">
  <media-icon class="vds-menu-button-close-icon" type="chevron-left" />
  <slot name="icon" />
  <span class="vds-menu-button-label">{label}</span>
  <span class="vds-menu-button-hint" data-part="hint"></span>
  <media-icon class="vds-menu-button-open-icon" type="chevron-right" />
</media-menu-button>
