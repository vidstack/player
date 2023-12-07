import * as React from 'react';

const errorStyle: React.CSSProperties = __DEV__
  ? {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '	#ff3333',
      padding: '24px',
      position: 'absolute',
      inset: '0',
      width: '100%',
      height: '100%',
    }
  : {};

export class ErrorBoundary extends React.Component<
  {
    children: React.ReactNode;
    fallback?: (error: Error) => React.ReactNode;
    onError: (error: Error) => void;
  },
  { hasError: Error | null }
> {
  static displayName = 'ErrorBoundary';

  override state: { hasError: Error | null } = { hasError: null };

  static getDerivedStateFromError(hasError: Error) {
    return { hasError };
  }

  override componentDidCatch(error: Error) {
    this.props.onError(error);
  }

  override render() {
    const error = this.state.hasError;

    if (error) {
      return (
        <div style={errorStyle}>
          {this.props.fallback?.(error) ?? (
            <div style={{ fontWeight: 'bold' }}>
              An error has occurred, see console for more information.
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
