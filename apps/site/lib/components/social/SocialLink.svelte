<script lang="ts">
  import clsx from 'clsx';
  import DiscordIcon from '~icons/ri/discord-fill';
  import GitHubIcon from '~icons/ri/github-fill';
  import TwitterIcon from '~icons/ri/twitter-fill';

  import { uppercaseFirstLetter } from '$lib/utils/string';

  export let width = 24;
  export let height = 24;
  export let type: 'discord' | 'gitHub' | 'twitter';
  export let title = uppercaseFirstLetter(type);
  export let showTitle = false;

  let _class = '';
  export { _class as class };

  const href = {
    discord: 'https://discord.com/invite/7RGU7wvsu9',
    gitHub: 'https://github.com/vidstack',
    twitter: 'https://twitter.com/vidstackjs?lang=en',
  };

  const icons = {
    discord: DiscordIcon,
    gitHub: GitHubIcon,
    twitter: TwitterIcon,
  };
</script>

<a
  href={href[type]}
  class={clsx(
    'group relative flex transform-gpu items-center rounded-md border-0 p-2 transition-transform hover:scale-[1.1]',
  )}
  target="_blank"
  rel="noreferrer"
>
  <svelte:component
    this={icons[type]}
    class={clsx($$slots.default && 'mr-2.5', _class)}
    {width}
    {height}
  />
  <span
    class={clsx(showTitle ? '768:block text-soft group-hover:text-inverse ml-2 hidden' : 'sr-only')}
  >
    {title}
  </span>
  <slot />
</a>
