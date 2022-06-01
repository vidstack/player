<script lang="ts">
  import clsx from 'clsx';

  import GitHubIcon from '~icons/ri/github-fill';

  import Chip from '$src/components/base/Chip.svelte';

  const openSourceProjects = [
    {
      name: 'Player',
      description: 'Video player built with headless web components to truly make it your own.',
      badge: 'Beta',
      repoHref: 'https://github.com/vidstack/player',
    },
    {
      name: 'Uploader',
      description:
        'Customizable video uploader with multiple provider integrations out of the box.',
      badge: 'Pre-alpha',
      repoHref: 'https://github.com/vidstack/uploader',
    },
    {
      name: 'Analytics',
      description: 'Collect video performance and user-behavior data with a few lines of HTML.',
      badge: 'Pre-alpha',
      repoHref: 'https://github.com/vidstack/analytics',
    },
  ];
</script>

<section class="flex flex-col mt-28 w-full px-4 items-center justify-center 992:mt-40">
  <h1 class="font-bold text-center text-4xl leading-[3.5rem] 768:text-5xl">Open Source</h1>

  <p class="max-w-lg mt-10 text-gray-soft text-center text-lg">
    You can find most our work on
    <a
      href="https://github.com/vidstack"
      target="_blank"
      rel="noreferrer"
      class="border-brand rounded-sm font-medium text-brand -mr-1 hover:border-b"
    >
      GitHub
    </a>. Watch the releases of each repository to be up to date with the latest.
  </p>

  <div class="mt-16 grid pb-10 gap-12 grid-cols-1 1200:grid-cols-3">
    {#each openSourceProjects as project (project)}
      <div
        class="border-gray-outline rounded-md flex flex-col max-w-xs border-2 h-[224px] shadow-md p-4 pb-0 z-10 relative"
      >
        <div class="flex flex-row items-center">
          <h2 class="font-medium text-xl">{project.name}</h2>

          <div class="flex-1" />

          <Chip
            class={clsx(
              'ml-3 text-gray-50',
              project.badge === 'Beta' && 'bg-green-600',
              project.badge === 'Pre-alpha' && 'bg-amber-600',
            )}>{project.badge}</Chip
          >
        </div>
        <p class="flex-1 mt-6 text-gray-soft text-base leading-7">
          {project.description}
        </p>
        <div class="rounded-b-lg flex py-6 justify-end">
          <a class="rounded-sm flex items-center" href={project.repoHref} target="_blank">
            <GitHubIcon class="h-7 text-gray-soft w-7 hover:text-gray-inverse" />
            <span class="sr-only">{`Vidstack ${project.name} GitHub Repo`}</span>
          </a>
        </div>
      </div>
    {/each}
  </div>
</section>
