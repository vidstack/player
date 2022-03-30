<script lang="ts">
  import MoonIcon from '~icons/ri/moon-clear-fill';
  import SunIcon from '~icons/ri/sun-fill';
  import SettingsIcon from '~icons/ri/settings-2-fill';

  import Menu from '$lib/components/base/Menu.svelte';
  import MenuItem from '$lib/components/base/MenuItem.svelte';
  import { colorScheme, colorSchemes, isDarkColorScheme } from '$lib/stores/colorScheme';
  import { uppercaseFirstLetter } from '@vidstack/foundation';

  const buttonIcon = {
    light: SunIcon,
    dark: MoonIcon,
    system: $isDarkColorScheme ? MoonIcon : SunIcon,
  };

  const menuIcon = {
    ...buttonIcon,
    system: SettingsIcon,
  };
</script>

<Menu>
  <svelte:fragment slot="button">
    <svelte:component this={buttonIcon[$colorScheme]} class={'h-6 w-6'} />
    <span class="sr-only">Color Scheme</span>
  </svelte:fragment>

  {#each colorSchemes as scheme (scheme)}
    <MenuItem selected={$colorScheme === scheme} on:select={() => ($colorScheme = scheme)}>
      <svelte:component this={menuIcon[scheme]} slot="icon" />
      {uppercaseFirstLetter(scheme)}
    </MenuItem>
  {/each}
</Menu>
