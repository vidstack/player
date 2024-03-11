/* -------------------------------------------------------------------------------------------------
 * Credit: https://github.com/radix-ui/primitives/blob/main/packages/react/primitive/src/Primitive.tsx
 * -----------------------------------------------------------------------------------------------*/

import * as React from 'react';

import { Slot } from './slot';

/* -------------------------------------------------------------------------------------------------
 * Primitive
 * -----------------------------------------------------------------------------------------------*/

const NODES = ['button', 'div', 'span', 'img', 'video', 'audio'] as const;

export const Primitive = NODES.reduce((primitives, node) => {
  const Node = React.forwardRef((props: PrimitivePropsWithRef<typeof node>, forwardedRef: any) => {
    const { asChild, ...primitiveProps } = props;
    const Comp: any = asChild ? Slot : node;
    return <Comp {...primitiveProps} ref={forwardedRef} />;
  });

  Node.displayName = `Primitive.${node}`;

  return { ...primitives, [node]: Node };
}, {} as Primitives);

/* -------------------------------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------------------------*/

// Temporary while we await merge of this fix:
// https://github.com/DefinitelyTyped/DefinitelyTyped/pull/55396
type PropsWithoutRef<P> = P extends any
  ? 'ref' extends keyof P
    ? Pick<P, Exclude<keyof P, 'ref'>>
    : P
  : P;

export type ComponentPropsWithoutRef<T extends React.ElementType> = PropsWithoutRef<
  React.ComponentProps<T>
>;

type Primitives = { [E in (typeof NODES)[number]]: PrimitiveForwardRefComponent<E> };

export type PrimitivePropsWithRef<E extends React.ElementType> = Omit<
  React.ComponentProps<E>,
  'style'
> &
  React.Attributes & {
    asChild?: boolean;
    style?:
      | React.CSSProperties
      | (React.CSSProperties & Record<`--${string}`, string | null | undefined>)
      | undefined;
  };

interface PrimitiveForwardRefComponent<E extends React.ElementType>
  extends React.ForwardRefExoticComponent<PrimitivePropsWithRef<E>> {}
