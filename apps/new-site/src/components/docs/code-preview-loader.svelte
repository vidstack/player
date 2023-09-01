<script lang="ts">
  import type { CodePreview } from ':code_previews';

  import { codePreviews } from '../../stores/code-previews';

  export let id: string | undefined;

  let component: any = undefined;

  async function loadPreview(previews: CodePreview[], id: string | undefined) {
    component = undefined;

    if (!id) return;

    const preview = previews.find((preview) => preview.id === id);
    if (preview) {
      component = (await preview.loader()).default;
    }
  }

  $: loadPreview($codePreviews, id);
</script>

<div>
  <svelte:component this={component} />
</div>
