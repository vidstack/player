<script lang="ts">
  import clsx from 'clsx';

  import LinkIcon from '~icons/lucide/link';

  import slugify from 'slugify';

  export let title: string;
  export let level: number;
  export let slug: string | undefined = undefined;

  let _class: string | undefined = undefined;
  export { _class as class };

  const titleSlug = slugify(slug ?? title, { lower: true });
</script>

<div class={clsx('heading-wrapper', _class)}>
  <svelte:element this={`h${level}`} id={titleSlug}>
    {title}
  </svelte:element>
  <a href={`#${titleSlug}`} class="anchor-link">
    <LinkIcon class="anchor-icon" />
    <span class="sr-only">Section titled {title}</span>
  </a>
</div>
