<script lang="ts">
  import { getTerminalContext } from './context';

  const { directory, branch } = getTerminalContext();
</script>

<span class="font-mono font-semibold mr-1 text-cyan-400">{directory}</span>

<!-- Branch -->
<div class="flex items-center mx-1 font-mono">
  <span class="font-semibold text-indigo-400">git:(</span>
  <span class="font-semibold text-red-400">{branch}</span>
  <span class="font-semibold text-indigo-400">)</span>
</div>
