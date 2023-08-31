<script lang="ts">
  import MoreIcon from '~icons/lucide/more-horizontal';
  import SmileIcon from '~icons/lucide/smile';

  import VidstackSymbol from '../icons/logos/vidstack-symbol.svelte';
</script>

<div class="flex w-full @container">
  <div class="grow-0 shrink-0">
    <div class="border border-border/90 rounded-md overflow-hidden shadow-md">
      <VidstackSymbol size={28} />
    </div>
  </div>
  <div class="border border-border/90 ml-4 bg-body rounded-md flex-1 overflow-hidden shadow-md">
    <div class="px-2.5 py-2 bg-elevate flex items-center border-b border-border/90">
      <div class="font-semibold text-sm">vidstack</div>
      <div class="border rounded-full border-border/90 px-1.5 py-px text-soft ml-1.5 text-xs">
        bot
      </div>
      <div class="w-1 h-1 bg-soft rounded-full ml-1.5"></div>
      <div class="text-soft ml-1.5 text-sm">
        <span class="@md:hidden">2 mins ago</span>
        <span class="hidden @md:block">commented 2 minutes ago</span>
      </div>
      <div class="flex-1"></div>
      <SmileIcon class="w-4 h-4 text-soft" />
      <MoreIcon class="w-4 h-4 text-soft ml-2" />
    </div>
    <div class="p-4">
      <slot />
    </div>
  </div>
</div>
