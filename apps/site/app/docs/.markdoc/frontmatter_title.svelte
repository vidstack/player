<script>
  import { frontmatter } from '@vessel-js/svelte';

  import Heading from './@node/heading.svelte';

  $: title = $frontmatter?.title ?? '';
  $: id = title.replace(/\s/g, '-').toLowerCase();
</script>

<Heading {id} level={1}>
  {title}
</Heading>
