import * as React from 'react';

import { composeRefs, createReactComponent, type ReactElementProps } from 'maverick.js/react';

import { ControlsGroupInstance, ControlsInstance } from '../primitives/instances';
import { Primitive } from '../primitives/nodes';

/* -------------------------------------------------------------------------------------------------
 * Controls
 * -----------------------------------------------------------------------------------------------*/

const ControlsBridge = createReactComponent(ControlsInstance);

export interface RootProps extends ReactElementProps<ControlsInstance> {
  asChild?: boolean;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLElement>;
}

/**
 * This component creates a container for control groups.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/media/controls}
 * @example
 * ```tsx
 * <Controls.Root>
 *   <Controls.Group></Controls.Group>
 *   <Controls.Group></Controls.Group>
 * <Controls.Root>
 * ```
 */
const Root = React.forwardRef<HTMLElement, RootProps>(({ children, ...props }, forwardRef) => {
  return (
    <ControlsBridge {...(props as Omit<RootProps, 'ref'>)}>
      {(props) => (
        <Primitive.div
          {...props}
          ref={composeRefs(props.ref as React.Ref<any>, forwardRef as React.Ref<any>)}
        >
          {children}
        </Primitive.div>
      )}
    </ControlsBridge>
  );
});

Root.displayName = 'Controls';

/* -------------------------------------------------------------------------------------------------
 * ControlsGroup
 * -----------------------------------------------------------------------------------------------*/

const ControlsGroupBridge = createReactComponent(ControlsGroupInstance);

export interface GroupProps extends ReactElementProps<ControlsGroupInstance> {
  asChild?: boolean;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLElement>;
}

/**
 * This component creates a container for media controls.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/media/controls#group}
 * @example
 * ```tsx
 * <Controls.Root>
 *   <Controls.Group></Controls.Group>
 *   <Controls.Group></Controls.Group>
 * <Controls.Root>
 * ```
 */
const Group = React.forwardRef<HTMLElement, GroupProps>(({ children, ...props }, forwardRef) => {
  return (
    <ControlsGroupBridge {...(props as Omit<GroupProps, 'ref'>)}>
      {(props) => (
        <Primitive.div
          {...props}
          ref={composeRefs(props.ref as React.Ref<any>, forwardRef as React.Ref<any>)}
        >
          {children}
        </Primitive.div>
      )}
    </ControlsGroupBridge>
  );
});

Group.displayName = 'ControlsGroup';

export { Root, Group };
