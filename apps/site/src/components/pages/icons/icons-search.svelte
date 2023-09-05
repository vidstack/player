<script lang="ts">
  import SearchInput from '../../search-input.svelte';
  import { iconSearchText } from './shared';
</script>

<SearchInput placeholder="Search all icons..." bind:value={$iconSearchText} />
