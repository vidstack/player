<script>
  import ComponentPreview from '$lib/components/preview/ComponentPreview.svelte';
</script>

<div class="mx-auto flex max-w-[720px] flex-col px-4 pb-20">
  <div class="text-gray-inverse text-3xl font-medium">
    <slot name="heading" />
  </div>

  <div class="text-gray-soft mt-6 w-full text-left">
    <slot name="description" />
  </div>

  <ComponentPreview>
    <slot />
  </ComponentPreview>
</div>
