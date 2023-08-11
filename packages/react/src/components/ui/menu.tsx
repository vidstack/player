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

export interface PortalProps extends Omit<ReactElementProps<MenuPortalInstance>, 'container'> {
  asChild?: boolean;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLElement>;
}

/**
 * Portals menu items into the document body.
 *
 * @docs {@link https://www.vidstack.io/docs/react/player/components/menu#portal}
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
            ref={forwardRef as any}
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
