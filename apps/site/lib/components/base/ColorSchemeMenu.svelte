<script lang="ts">
  import clsx from 'clsx';
  import MoonIcon from '~icons/ri/moon-clear-fill';
  import SettingsIcon from '~icons/ri/settings-2-fill';
  import SunIcon from '~icons/ri/sun-fill';

  import Menu from '$lib/components/base/Menu.svelte';
  import MenuItem from '$lib/components/base/MenuItem.svelte';
  import { colorScheme, colorSchemes, isDarkColorScheme } from '$lib/stores/color-scheme';
  import { uppercaseFirstLetter } from '$lib/utils/string';

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
    <svelte:component this={buttonIcon[$colorScheme]} class="h-[22px] w-[22px]" />
    <span class="sr-only">Color Scheme</span>
  </svelte:fragment>

  {#each colorSchemes as scheme (scheme)}
    <MenuItem selected={$colorScheme === scheme} on:select={() => ($colorScheme = scheme)}>
      <svelte:component
        this={menuIcon[scheme]}
        slot="icon"
        class={clsx(scheme === 'light' ? 'w-[22px] h-[22px]' : 'w-5 h-5')}
      />
      {uppercaseFirstLetter(scheme)}
    </MenuItem>
  {/each}
</Menu>
