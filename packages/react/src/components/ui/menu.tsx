import * as React from 'react';

import { composeRefs, createReactComponent, type ReactElementProps } from 'maverick.js/react';
import { createPortal } from 'react-dom';

import { IS_SERVER } from '../../env';
import { useMediaState } from '../../hooks/use-media-state';
import {
  MenuButtonInstance,
  MenuInstance,
  MenuItemInstance,
  MenuItemsInstance,
  MenuPortalInstance,
} from '../primitives/instances';
import { Primitive } from '../primitives/nodes';

/* -------------------------------------------------------------------------------------------------
 * Menu
 * -----------------------------------------------------------------------------------------------*/

const MenuBridge = createReactComponent(MenuInstance, {
  events: ['onOpen', 'onClose'],
  domEventsRegex: /^onMedia/,
});

export interface RootProps extends ReactElementProps<MenuInstance> {
  asChild?: boolean;
  children: React.ReactNode;
  ref?: React.Ref<MenuInstance>;
}

/**
 * Root menu container used to hold and manage a menu button and menu items. This component is
 * used to display options in a floating panel. They can be nested to create submenus.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/menu/menu}
 * @example
 * ```tsx
 * <Menu.Root>
 *   <Menu.Button></Menu.Button>
 *   <Menu.Content placement="top end"></Menu.Content>
 * </Menu.Root>
 * ```
 */
const Root = React.forwardRef<MenuInstance, RootProps>(({ children, ...props }, forwardRef) => {
  return (
    <MenuBridge {...props} ref={forwardRef}>
      {(props, instance) => (
        <Primitive.div
          {...props}
          style={{ display: !instance.isSubmenu ? 'contents' : undefined, ...props.style }}
        >
          {children}
        </Primitive.div>
      )}
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
 * `menuitem` when used inside a submenu.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/menu/menu}
 * @example
 * ```tsx
 * <Menu.Root>
 *   <Menu.Button></Menu.Button>
 *   <Menu.Content placement="top end"></Menu.Content>
 * </Menu.Root>
 * ```
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, ...props }, forwardRef) => {
    return (
      <ButtonBridge {...(props as Omit<ButtonProps, 'ref'>)}>
        {(props) => (
          <Primitive.button
            {...props}
            ref={composeRefs(props.ref as React.Ref<any>, forwardRef as React.Ref<any>)}
          >
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

export interface PortalProps extends Omit<ReactElementProps<MenuPortalInstance>, 'container'> {
  asChild?: boolean;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLElement>;
}

/**
 * Portals menu items into the document body.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/menu#portal}
 * @example
 * ```tsx
 * <Menu.Root>
 *   <Menu.Button></Menu.Button>
 *   <Menu.Portal>
 *     <Menu.Content placement="top end"></Menu.Content>
 *   </Menu.Portal>
 * </Menu.Root>
 * ```
 */
const Portal = React.forwardRef<HTMLElement, PortalProps>(
  ({ disabled = false, children, ...props }, forwardRef) => {
    let fullscreen = useMediaState('fullscreen'),
      shouldPortal = disabled === 'fullscreen' ? !fullscreen : !disabled;
    return IS_SERVER || !shouldPortal
      ? children
      : createPortal(
          <Primitive.div
            {...props}
            style={{ display: 'contents', ...props.style }}
            ref={forwardRef as React.Ref<any>}
          >
            {children}
          </Primitive.div>,
          document.body,
        );
  },
);

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
 * Used to group and display settings or arbitrary content in a floating panel.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/menu/menu}
 * @example
 * ```tsx
 * <Menu.Root>
 *   <Menu.Button></Menu.Button>
 *   <Menu.Items placement="top end"></Menu.Items>
 * </Menu.Root>
 * ```
 */
const Items = React.forwardRef<HTMLElement, ItemsProps>(({ children, ...props }, forwardRef) => {
  return (
    <ItemsBridge {...(props as Omit<ItemsProps, 'ref'>)}>
      {(props) => (
        <Primitive.div
          {...props}
          ref={composeRefs(props.ref as React.Ref<any>, forwardRef as React.Ref<any>)}
        >
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
 * Represents a specific option or action, typically displayed as a text label or icon, which
 * users can select to access or perform a particular function or view related content.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/menu/menu}
 * @example
 * ```tsx
 * <Menu.Root>
 *   <Menu.Button></Menu.Button>
 *   <Menu.Content placement="top end">
 *     <Menu.Item></Menu.Item>
 *   </Menu.Content>
 * </Menu.Root>
 * ```
 */
const Item = React.forwardRef<HTMLElement, ItemProps>(({ children, ...props }, forwardRef) => {
  return (
    <ItemBridge {...(props as Omit<ItemProps, 'ref'>)}>
      {(props) => (
        <Primitive.div
          {...props}
          ref={composeRefs(props.ref as React.Ref<any>, forwardRef as React.Ref<any>)}
        >
          {children}
        </Primitive.div>
      )}
    </ItemBridge>
  );
});

Item.displayName = 'MenuItem';

export { Root, Button, Portal, Items, Items as Content, type ItemsProps as ContentProps, Item };
export {
  Root as RadioGroup,
  Item as Radio,
  type RootProps as RadioGroupProps,
  type ItemProps as RadioProps,
} from './radio-group';
