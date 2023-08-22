<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  import { createAriaDialog } from '../aria/dialog';
  import Button from './button.svelte';
  import DialogPopup from './dialog-popup.svelte';

  const dispatch = createEventDispatcher<{
    show: void;
    hide: void;
  }>();

  const { menu, menuTrigger, isMenuOpen, isMenuVisible, closeMenu } = createAriaDialog();

  $: dispatch($isMenuVisible ? 'show' : 'hide');
</script>

<Button action={menuTrigger} {...$$restProps}>
  <slot name="trigger" />
</Button>

<!-- Menu -->
<DialogPopup open={$isMenuOpen} visible={$isMenuVisible} action={menu} on:pointerup={closeMenu}>
  <slot name="content" />
</DialogPopup>
