/**
 * Adapted from https://github.com/lit/lit/blob/main/packages/labs/react/src/create-component.ts.
 */

import { type Constructor, safelyDefineCustomElement } from '@vidstack/foundation';
import * as ReactModule from 'react';
import type { PascalCase } from 'type-fest';

import { setProperty, setRef } from './utils';

const reservedReactProperties = new Set(['children', 'localName', 'ref', 'style', 'className']);

export type VdsElementEventCallbackMap = {
  [Event in keyof VdsElementEventMap as `on${PascalCase<Event>}`]: (
    event: VdsElementEventMap[Event],
  ) => void;
};

export type VdsReactComponentProps<E extends HTMLElement> = Partial<Omit<E, 'children'>> &
  Partial<VdsElementEventCallbackMap> &
  React.HTMLAttributes<E> & {
    ref?: React.Ref<E> | undefined;
    children?: React.ReactNode | undefined;
  };

export const createComponent = <E extends HTMLElement>(
  React: typeof ReactModule,
  tagName: string,
  elementClass: Constructor<E>,
) => {
  const Component = React.Component;
  const createElement = React.createElement;

  type Props = VdsReactComponentProps<E>;
  type ElementRef = React.Ref<E>;

  // Props used by this component wrapper. This is the UserProps and the
  // special `__forwardedRef` property. Note, this ref is special because
  // it's both needed in this component to get access to the rendered element
  // and must fulfill any ref passed by the user.
  type ComponentProps = Props & {
    __forwardedRef?: ElementRef;
  };

  const elementClassProps = new Set();
  for (const p in elementClass.prototype) {
    if (!(p in HTMLElement.prototype) && !reservedReactProperties.has(p)) {
      elementClassProps.add(p);
    }
  }

  class ReactComponent extends Component<ComponentProps> {
    private _element: E | null = null;
    private _elementProps!: { [index: string]: unknown };
    private _userRef?: ElementRef;
    private _ref?: React.RefCallback<E>;

    static displayName = (elementClass as { name: string }).name.replace('Element', '');

    private _updateElement(oldProps?: ComponentProps) {
      if (this._element === null) return;

      for (const prop in this._elementProps) {
        setProperty(
          this._element,
          prop,
          this.props[prop as keyof ComponentProps],
          oldProps ? oldProps[prop as keyof ComponentProps] : undefined,
        );
      }
    }

    override componentDidMount() {
      safelyDefineCustomElement(tagName, elementClass);
      this._updateElement();
    }

    override componentDidUpdate(old: ComponentProps) {
      this._updateElement(old);
    }

    override render() {
      // Since refs only get fulfilled once, pass a new one if the user's
      // ref changed. This allows refs to be fulfilled as expected, going from
      // having a value to null.
      const userRef = this.props.__forwardedRef as ElementRef;

      if (this._ref === undefined || this._userRef !== userRef) {
        this._ref = (value: E | null) => {
          if (this._element === null) {
            this._element = value;
          }

          if (userRef !== null) {
            setRef(userRef, value);
          }

          this._userRef = userRef;
        };
      }

      const props: any = { ref: this._ref };

      this._elementProps = {};

      for (const [k, v] of Object.entries(this.props)) {
        if (elementClassProps.has(k) || k.startsWith('onVds')) {
          this._elementProps[k] = v;
        } else {
          // React does *not* handle `className` for custom elements so
          // coerce it to `class` so it's handled correctly.
          props[k === 'className' ? 'class' : k] = v;
        }
      }

      return createElement(tagName, props);
    }
  }

  const ForwardedComponent = React.forwardRef((props?: Props, ref?: ElementRef) =>
    createElement(
      ReactComponent,
      { ...props, __forwardedRef: ref } as ComponentProps,
      props?.children,
    ),
  );

  // To ease debugging in the React Developer Tools
  ForwardedComponent.displayName = ReactComponent.displayName;

  return ForwardedComponent;
};
