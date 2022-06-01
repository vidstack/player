<script>
  import { frontmatter } from '@vitebook/svelte';

  import Heading from './@nodes/heading.svelte';

  $: title = $frontmatter?.title ?? '';
  $: id = title.replace(/\s/g, '-').toLowerCase();
</script>

<Heading {id} level={1}>
  {title}
</Heading>
