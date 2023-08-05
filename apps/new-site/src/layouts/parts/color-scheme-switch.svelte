<script context="module">
  import SystemIcon from '~icons/lucide/monitor';
  import MoonIcon from '~icons/lucide/moon-star';
  import SunIcon from '~icons/lucide/sun';

  const Icons = {
    light: SunIcon,
    dark: MoonIcon,
    system: SystemIcon,
  };
</script>

<script lang="ts">
  import Switch from '../../components/switch.svelte';
  import { colorScheme, colorSchemes, type ColorScheme } from '../../stores/color-scheme';

  function onSelect({ detail }: CustomEvent<string>) {
    $colorScheme = detail as ColorScheme;
  }
</script>

<Switch
  label="Color Scheme"
  defaultValue={$colorScheme}
  value={colorScheme}
  options={colorSchemes.map((scheme) => ({ value: scheme, Icon: Icons[scheme] }))}
  on:select={onSelect}
/>
