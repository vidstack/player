<script lang="ts">
  import clsx from 'clsx';

  import { onMount } from 'svelte';

  import { fetchGitHubStars } from '../api/github';
  import AnimatedGithubIcon from '../icons/animated/animated-github-icon.svelte';
  import { isSameDay } from '../utils/date';
  import Tooltip from './tooltip.svelte';

  let _class = '';
  export { _class as class };

  export let owner: string;
  export let repo: string;

  let stars = 0,
    storageKey = `vidstack:github:stars:${owner}/${repo}`,
    lastCheckedKey = `vidstack:github:stars:checked:${owner}/${repo}`;

  onMount(async () => {
    const savedStars = window.localStorage.getItem(storageKey);
    if (savedStars && +savedStars > 0) stars = +savedStars;

    const lastChecked = window.localStorage.getItem(lastCheckedKey),
      now = new Date();

    if (!lastChecked || !isSameDay(new Date(+lastChecked), now)) {
      const fetchedStars = await fetchGitHubStars(owner, repo);
      if (fetchedStars > 0) {
        window.localStorage.setItem(storageKey, fetchedStars + '');
        stars = fetchedStars;
        window.localStorage.setItem(lastCheckedKey, Date.now() + '');
      }
    }
  });
</script>

<Tooltip
  class={clsx(
    'group flex items-center justify-center border border-transparent rounded-md px-2 py-1.5',
    'hocus:border-border/90 hocus:bg-elevate hocus:shadow-sm',
    _class,
  )}
  href={`https://github.com/${owner}/${repo}`}
  target="_blank"
  rel="noreferrer"
  aria-label="GitHub"
>
  <svelte:fragment slot="trigger">
    {#if stars > 0}
      <span
        class={clsx(
          'mr-1 text-xs font-semibold transition-all opacity-0 w-0',
          'group-hocus:opacity-100 group-hocus:w-auto overflow-hidden',
        )}
      >
        {(stars / 1000).toFixed(1)}k
      </span>
    {/if}
    <AnimatedGithubIcon class="w-6 h-6 shrink-0" skipInitial />
  </svelte:fragment>

  <svelte:fragment slot="content">GitHub</svelte:fragment>
</Tooltip>
