<script lang="ts">
  import SplitCodePane from '../../split-pane/split-code-pane.svelte';
</script>

<SplitCodePane class="flex-1 flex w-full flex-col @4xl:flex-row">
  <div class="flex pl-3 pr-1 py-2.5 overflow-auto" style="display: none" data-pane slot="left">
    <slot name="editor" />
  </div>

  <div
    class="flex items-center justify-center p-2 overflow-auto"
    style="display: none"
    data-pane
    slot="right"
  >
    <slot name="preview" />
  </div>
</SplitCodePane>
