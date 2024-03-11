import * as React from 'react';

import {
  composeRefs,
  createReactComponent,
  type ReactElementProps,
  type ReactProps,
} from 'maverick.js/react';

import {
  TooltipContentInstance,
  TooltipInstance,
  TooltipTriggerInstance,
} from '../primitives/instances';
import { Primitive } from '../primitives/nodes';

/* -------------------------------------------------------------------------------------------------
 * Tooltip
 * -----------------------------------------------------------------------------------------------*/

const TooltipBridge = createReactComponent(TooltipInstance);

export interface RootProps extends ReactProps<TooltipInstance> {
  asChild?: boolean;
  children: React.ReactNode;
}

/**
 * A contextual text bubble that displays a description for an element that appears on pointer
 * hover or keyboard focus.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/tooltip}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/tooltip_role}
 * @example
 * ```tsx
 * <Tooltip.Root>
 *   <Tooltip.Trigger></Tooltip.Trigger>
 *   <Tooltip.Content></Tooltip.Content>
 * </Tooltip.Root>
 * ```
 */
function Root({ children, ...props }: RootProps) {
  return <TooltipBridge {...props}>{children}</TooltipBridge>;
}

Root.displayName = 'Tooltip';

/* -------------------------------------------------------------------------------------------------
 * TooltipTrigger
 * -----------------------------------------------------------------------------------------------*/

const TriggerBridge = createReactComponent(TooltipTriggerInstance);

export interface TriggerProps extends ReactElementProps<TooltipTriggerInstance> {
  asChild?: boolean;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLButtonElement>;
}

/**
 * Wraps the element that will trigger showing/hiding the tooltip on hover or keyboard focus. The
 * tooltip content is positioned relative to this element.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/tooltip}
 * @example
 * ```tsx
 * <Tooltip.Root>
 *   <Tooltip.Trigger></Tooltip.Trigger>
 *   <Tooltip.Content></Tooltip.Content>
 * </Tooltip.Root>
 * ```
 */
const Trigger = React.forwardRef<HTMLButtonElement, TriggerProps>(
  ({ children, ...props }, forwardRef) => {
    return (
      <TriggerBridge {...(props as Omit<TriggerProps, 'ref'>)}>
        {(props) => (
          <Primitive.button
            {...props}
            ref={composeRefs(props.ref as React.Ref<any>, forwardRef as React.Ref<any>)}
          >
            {children}
          </Primitive.button>
        )}
      </TriggerBridge>
    );
  },
);

Trigger.displayName = 'TooltipTrigger';

/* -------------------------------------------------------------------------------------------------
 * TooltipContent
 * -----------------------------------------------------------------------------------------------*/

const ContentBridge = createReactComponent(TooltipContentInstance);

export interface ContentProps extends ReactElementProps<TooltipContentInstance> {
  asChild?: boolean;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLElement>;
}

/**
 * This component contains the content that is visible when the tooltip trigger is interacted with.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/tooltip}
 * @example
 * ```tsx
 * <Tooltip.Root>
 *   <Tooltip.Trigger></Tooltip.Trigger>
 *   <Tooltip.Content></Tooltip.Content>
 * </Tooltip.Root>
 * ```
 */
const Content = React.forwardRef<HTMLElement, ContentProps>(
  ({ children, ...props }, forwardRef) => {
    return (
      <ContentBridge {...(props as Omit<ContentProps, 'ref'>)}>
        {(props) => (
          <Primitive.div
            {...props}
            ref={composeRefs(props.ref as React.Ref<any>, forwardRef as React.Ref<any>)}
          >
            {children}
          </Primitive.div>
        )}
      </ContentBridge>
    );
  },
);

Content.displayName = 'TooltipContent';

export { Root, Trigger, Content };
