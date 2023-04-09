<script lang="ts">
  export let title: string;
</script>

<div class="p-6 border-border border-[1px] rounded-lg">
  <div class="flex items-center">
    <slot name="icon" />
    <h3 class="text-xl font-medium ml-1.5">{title}</h3>
  </div>
  <p class="max-w-[400px] mt-3 tracking-wide font-normal text-soft">
    <slot />
  </p>
</div>
