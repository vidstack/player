<script lang="ts">
  import clsx from 'clsx';

  import GitHubIcon from '~icons/ri/github-fill';

  import { Chip } from '@svelteness/kit-docs';

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

<section class="992:mt-40 mt-28 flex w-full flex-col items-center justify-center px-4">
  <h1 class="768:text-5xl text-center text-4xl font-bold leading-[3.5rem]">Open Source</h1>

  <p class="text-gray-soft mt-10 max-w-lg text-center text-lg">
    You can find most our work on
    <a
      href="https://github.com/vidstack"
      target="_blank"
      rel="noreferrer"
      class="border-brand text-brand -mr-1 font-medium hover:border-b"
    >
      GitHub
    </a>. Watch the releases of each repository to be up to date with the latest.
  </p>

  <div class="1200:grid-cols-3 mt-16 grid grid-cols-1 gap-12 pb-10">
    {#each openSourceProjects as project (project)}
      <div
        class="border-gray-divider relative z-10 flex h-[224px] max-w-xs flex-col rounded-md border-2 p-4 pb-0 shadow-md"
      >
        <div class="flex flex-row items-center">
          <h2 class="text-xl font-medium">{project.name}</h2>

          <div class="flex-1" />

          <Chip
            class={clsx(
              'ml-3 text-gray-50',
              project.badge === 'Beta' && 'bg-green-600',
              project.badge === 'Pre-alpha' && 'bg-amber-600',
            )}>{project.badge}</Chip
          >
        </div>
        <p class="text-gray-soft mt-6 flex-1 text-base leading-7">
          {project.description}
        </p>
        <div class="flex justify-end rounded-b-lg py-6">
          <a class="flex items-center" href={project.repoHref} target="_blank">
            <GitHubIcon class="text-gray-soft hover:text-gray-inverse h-7 w-7" />
            <span class="sr-only">{`Vidstack ${project.name} GitHub Repo`}</span>
          </a>
        </div>
      </div>
    {/each}
  </div>
</section>
