<script lang="ts">
  import clsx from 'clsx';
  import { uppercaseFirstLetter } from '@vidstack/foundation';

  import DiscordIcon from '~icons/ri/discord-fill';
  import GitHubIcon from '~icons/ri/github-fill';
  import TwitterIcon from '~icons/ri/twitter-fill';

  export let type: 'discord' | 'gitHub' | 'twitter';
  export let title = uppercaseFirstLetter(type);

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
  class="rounded-md flex border-0 text-gray-soft p-2 relative items-center hover:text-gray-inverse transform-gpu transition-transform hover:scale-[1.1]"
  target="_blank"
>
  <svelte:component
    this={icons[type]}
    class={clsx($$slots.default && 'mr-2.5')}
    width="24"
    height="24"
  />
  <span class="sr-only">{title}</span>
  <slot />
</a>
