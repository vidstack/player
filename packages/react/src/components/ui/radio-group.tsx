/* -------------------------------------------------------------------------------------------------
 * RadioGroup
 * -----------------------------------------------------------------------------------------------*/

import { composeRefs, createReactComponent, type ReactElementProps } from 'maverick.js/react';
import React from 'react';

import { RadioGroupInstance, RadioInstance } from '../primitives/instances';
import { Primitive } from '../primitives/nodes';

const GroupBridge = createReactComponent(RadioGroupInstance, {
  events: ['onChange'],
});

export interface GroupProps extends ReactElementProps<RadioGroupInstance> {
  asChild?: boolean;
  children?: React.ReactNode;
  ref?: React.Ref<RadioGroupInstance>;
}

/**
 * A radio group consists of options where only one of them can be checked. Each option is
 * provided as a radio (i.e., a selectable element).
 *
 * @docs {@link https://www.vidstack.io/docs/react/player/components/menu/radio-group}
 */
const Group = React.forwardRef<RadioGroupInstance, GroupProps>(
  ({ children, ...props }, forwardRef) => {
    return (
      <GroupBridge {...props} ref={forwardRef}>
        {(props) => <Primitive.div {...props}>{children}</Primitive.div>}
      </GroupBridge>
    );
  },
);

Group.displayName = 'RadioGroup';

/* -------------------------------------------------------------------------------------------------
 * RadioItem
 * -----------------------------------------------------------------------------------------------*/

const ItemBridge = createReactComponent(RadioInstance, {
  events: ['onChange', 'onSelect'],
});

export interface ItemProps extends ReactElementProps<RadioInstance> {
  asChild?: boolean;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLElement>;
}

/**
 * A radio represents a option that a user can select inside of a radio group. Only one radio
 * can be checked in a group.
 *
 * @docs {@link https://www.vidstack.io/docs/react/player/components/menu/radio}
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

Item.displayName = 'RadioItem';

export { Group, Item };
