<script lang="ts">
  import clsx from 'clsx';
</script>

<div
  {...$$restProps}
  class={clsx('flex-col border border-border rounded-md p-4', $$restProps.class)}
>
  <div class="flex items-center">
    <div class="rounded-full bg-inverse/10 p-1 mr-1.5">
      <div class="w-6 h-6 flex items-center justify-center">
        <slot name="icon" />
      </div>
    </div>
    <span class="font-semibold text-lg">
      <slot name="title" />
    </span>
  </div>
  <p class="text-sm text-soft mt-2">
    <slot name="feedback" />
  </p>
</div>
