<script lang="ts">
  import clsx from 'clsx';

  import DiscordIcon from '~icons/ri/discord-fill';
  import GitHubIcon from '~icons/ri/github-fill';
  import TwitterIcon from '~icons/ri/twitter-fill';

  import { uppercaseFirstLetter } from '@vidstack/foundation';

  export let type: 'discord' | 'gitHub' | 'twitter';

  export let iconWidth = 28;
  export let iconHeight = 28;

  const icons = {
    discord: DiscordIcon,
    gitHub: GitHubIcon,
    twitter: TwitterIcon,
  };

  const href = {
    discord: 'https://discord.com/invite/7RGU7wvsu9',
    gitHub: 'https://github.com/vidstack',
    twitter: 'https://twitter.com/vidstackjs?lang=en',
  };

  $: title = uppercaseFirstLetter(type);
</script>

<a
  class="relative flex items-center text-gray-soft hover:text-gray-inverse"
  href={href[type]}
  target="_blank"
>
  <svelte:component
    this={icons[type]}
    class={clsx($$slots.default && 'mr-2.5')}
    width={iconWidth}
    height={iconHeight}
  />
  <span class="sr-only">{`Vidstack on ${title}`}</span>
  <slot {title} />
</a>
