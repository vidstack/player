<script lang="ts">
  import uFuzzy from '@leeoniya/ufuzzy';
  import type { IconType } from 'media-icons';
  import { onMount } from 'svelte';

  import { kebabToPascalCase, lowercaseFirstLetter } from '../../../utils/string';
  import { currentIconLibrary, formatIconName, iconSearchText } from './shared';

  let fuzzy = new uFuzzy(),
    tags: string[] = [],
    icons: HTMLElement[] = [];

  onMount(() => {
    icons = [...document.querySelectorAll<HTMLElement>('.icons-grid button[data-icon]')];

    import('./tags').then(({ tags: _tags }) => {
      tags = icons.map((icon) => {
        const iconName = icon.getAttribute('data-icon')!;
        return `${iconName}-${_tags[iconName as IconType].join('-')}`;
      });
    });

    return () => {
      tags.length = 0;
      icons.length = 0;
    };
  });

  $: indicies = fuzzy.filter(tags, normalizeSearchText($iconSearchText));
  $: filteredIcons = indicies?.map((i) => icons[i]) || icons;

  $: if (icons.length) {
    for (const icon of icons) icon.style.display = 'none';
    for (const icon of filteredIcons) icon.style.display = '';
  }

  $: if (icons.length) {
    for (const icon of icons) {
      const iconName = icon.getAttribute('data-icon')!,
        el = icon.querySelector('[data-icon-name]')! as HTMLElement;
      el.textContent = formatIconName(iconName, $currentIconLibrary);
      if (!el.style.opacity) el.style.opacity = '1';
    }
  }

  const upperCharRE = /[A-Z]/g;
  function normalizeSearchText(text: string) {
    return lowercaseFirstLetter(text.replace(/\s+/, '-')).replace(
      upperCharRE,
      (x) => '-' + x.toLowerCase(),
    );
  }
</script>

<slot />
