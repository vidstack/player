<script lang="ts">
  export let headers: string = '';

  $: parsedHeaders = JSON.parse(headers);
</script>

<nav>
  <ul>
    {#each parsedHeaders as header (header)}
      <li>{header.title}</li>
    {/each}
  </ul>
</nav>
