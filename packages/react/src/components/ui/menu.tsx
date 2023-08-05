import * as React from 'react';
import { computed, effect, provideContext } from 'maverick.js';
import {
  composeRefs,
  createReactComponent,
  useReactScope,
  useSignal,
  useStateContext,
  type ReactElementProps,
} from 'maverick.js/react';
import { createPortal } from 'react-dom';
import { mediaState, menuPortalContext } from 'vidstack/lib';
import {
  MenuButtonInstance,
  MenuInstance,
  MenuItemInstance,
  MenuItemsInstance,
} from '../primitives/instances';
import { Primitive } from '../primitives/nodes';

/* -------------------------------------------------------------------------------------------------
 * Menu
 * -----------------------------------------------------------------------------------------------*/

const MenuBridge = createReactComponent(MenuInstance, {
  events: ['onOpen', 'onClose'],
});

export interface RootProps extends ReactElementProps<MenuInstance> {
  asChild?: boolean;
  children: React.ReactNode;
  ref?: React.Ref<MenuInstance>;
}

/**
 * This component is used to display options in a floating panel.
 *
 * @docs {@link https://www.vidstack.io/docs/react/player/components/menu/menu}
 */
const Root = React.forwardRef<MenuInstance, RootProps>(({ children, ...props }, forwardRef) => {
  return (
    <MenuBridge {...props} ref={forwardRef}>
      {(props) => <Primitive.div {...props}>{children}</Primitive.div>}
    </MenuBridge>
  );
});

Root.displayName = 'Menu';

/* -------------------------------------------------------------------------------------------------
 * MenuButton
 * -----------------------------------------------------------------------------------------------*/

const ButtonBridge = createReactComponent(MenuButtonInstance, {
  events: ['onSelect'],
});

export interface ButtonProps extends ReactElementProps<MenuButtonInstance, HTMLButtonElement> {
  asChild?: boolean;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLButtonElement>;
}

/**
 * A button that controls the opening and closing of a menu component. The button will become a
 * menuitem when used inside a submenu.
 *
 * @docs {@link https://www.vidstack.io/docs/react/player/components/menu/menu}
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, ...props }, forwardRef) => {
    return (
      <ButtonBridge {...(props as Omit<ButtonProps, 'ref'>)}>
        {(props) => (
          <Primitive.button {...props} ref={composeRefs(props.ref, forwardRef)}>
            {children}
          </Primitive.button>
        )}
      </ButtonBridge>
    );
  },
);

Button.displayName = 'MenuButton';

/* -------------------------------------------------------------------------------------------------
 * Portal
 * -----------------------------------------------------------------------------------------------*/

export interface PortalProps {
  children?: React.ReactNode;
}

/**
 * Portals menu items into the document body when the player is at small breakpoints.
 *
 * - Horizontal breakpoint is used for audio
 * - Vertical breakpoint is used for video
 *
 * @docs {@link https://www.vidstack.io/docs/react/player/components/menu#portal}
 */
function Portal({ children }: PortalProps) {
  const media = useStateContext(mediaState),
    $shouldPortal = React.useMemo(
      () =>
        computed(() => {
          const { viewType, breakpointX, breakpointY, fullscreen } = media;
          return (
            (viewType() === 'audio' ? breakpointX() === 'sm' : breakpointY() === 'sm') &&
            !fullscreen()
          );
        }),
      [],
    );

  const scope = useReactScope()!,
    setup = React.useRef(false),
    portalCallback = React.useRef<((didPortal: boolean) => void) | null>();

  if (!setup.current) {
    provideContext(
      menuPortalContext,
      {
        _attach(_, callback) {
          portalCallback.current = callback;
          callback?.($shouldPortal());
        },
      },
      scope,
    );

    setup.current = true;
  }

  React.useEffect(() => {
    return effect(() => {
      portalCallback.current?.($shouldPortal());
    });
  }, [$shouldPortal]);

  const $$shouldPortal = useSignal($shouldPortal);
  return __SERVER__ || !$$shouldPortal ? children : createPortal(children, document.body);
}

Portal.displayName = 'MenuPortal';

/* -------------------------------------------------------------------------------------------------
 * MenuItems
 * -----------------------------------------------------------------------------------------------*/

const ItemsBridge = createReactComponent(MenuItemsInstance);

export interface ItemsProps extends ReactElementProps<MenuItemsInstance> {
  asChild?: boolean;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLElement>;
}

/**
 * Menu items can be used to display settings or arbitrary content in a floating panel.
 *
 * @docs {@link https://www.vidstack.io/docs/react/player/components/menu/menu}
 */
const Items = React.forwardRef<HTMLElement, ItemsProps>(({ children, ...props }, forwardRef) => {
  return (
    <ItemsBridge {...(props as Omit<ItemsProps, 'ref'>)}>
      {(props) => (
        <Primitive.div {...props} ref={composeRefs(props.ref, forwardRef)}>
          {children}
        </Primitive.div>
      )}
    </ItemsBridge>
  );
});

Items.displayName = 'MenuItems';

/* -------------------------------------------------------------------------------------------------
 * MenuItem
 * -----------------------------------------------------------------------------------------------*/

const ItemBridge = createReactComponent(MenuItemInstance);

export interface ItemProps extends ReactElementProps<MenuItemInstance> {
  asChild?: boolean;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLElement>;
}

/**
 * @docs {@link https://www.vidstack.io/docs/react/player/components/menu/menu}
 */
const Item = React.forwardRef<HTMLElement, ItemProps>(({ children, ...props }, forwardRef) => {
  return (
    <ItemBridge {...(props as Omit<ItemProps, 'ref'>)}>
      {(props) => (
        <Primitive.div {...props} ref={composeRefs(props.ref, forwardRef)}>
          {children}
        </Primitive.div>
      )}
    </ItemBridge>
  );
});

Item.displayName = 'MenuItem';

export { Root, Button, Portal, Items, Items as Content, type ItemsProps as ContentProps, Item };
export {
  Group as RadioGroup,
  Item as Radio,
  type GroupProps as RadioGroupProps,
  type ItemProps as RadioProps,
} from './radio-group';
