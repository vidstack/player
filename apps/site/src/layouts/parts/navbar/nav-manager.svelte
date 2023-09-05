<script lang="ts">
  import { onMount } from 'svelte';

  import { createAriaMenu } from '../../../aria/menu';
  import { isDarkColorScheme } from '../../../stores/color-scheme';
  import { DisposalBin } from '../../../utils/events';

  let root: HTMLElement;

  onMount(() => {
    const disposal = new DisposalBin(),
      menuTriggers = [...root.querySelectorAll<HTMLElement>('[data-menu-trigger]')],
      menus = [...root.querySelectorAll<HTMLElement>('[data-menu]')],
      submenuTriggers = [...root.querySelectorAll<HTMLElement>('[data-submenu-trigger]')],
      submenus = [...root.querySelectorAll<HTMLElement>('[data-submenu]')];

    for (let i = 0; i < menuTriggers.length; i++) {
      const trigger = menuTriggers[i],
        menu = menus[i],
        animatedIcon = trigger.querySelector<HTMLElement>('[data-animated-menu-icon]'),
        placement = menu.getAttribute('data-placement') as any,
        portal = menu.hasAttribute('data-portal'),
        aria = createAriaMenu({
          placement: placement !== 'none' && (placement || 'bottom-start'),
          portal,
          preventScroll: portal,
        });

      disposal.add(
        aria.menuTrigger(trigger),
        aria.menu(menu),
        aria.isMenuOpen.subscribe((isOpen) => {
          if (animatedIcon) {
            animatedIcon.classList.toggle('open', isOpen);
          }
        }),
      );
    }

    for (let i = 0; i < submenuTriggers.length; i++) {
      const trigger = submenuTriggers[i],
        submenu = submenus[i],
        arrow = submenu.querySelector<HTMLElement>('[data-submenu-arrow]')!,
        placement = submenu.getAttribute('data-placement') as any,
        hover = submenu.hasAttribute('data-hover'),
        showDelay = submenu.getAttribute('data-delay'),
        aria = createAriaMenu({
          placement,
          hover,
          submenu: true,
          showDelay: showDelay ? +showDelay : 200,
        });

      disposal.add(
        aria.menuTrigger(trigger),
        aria.menu(submenu),
        aria.menuArrow(arrow),
        aria.isMenuOpen.subscribe((isOpen) => {
          trigger.classList.toggle($isDarkColorScheme ? 'light' : 'dark', isOpen);
        }),
      );
    }

    return () => {
      disposal.dispose();
    };
  });
</script>

<div class="contents" bind:this={root}>
  <slot />
</div>
