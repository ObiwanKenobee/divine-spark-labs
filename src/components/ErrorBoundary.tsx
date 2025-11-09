import React from 'react';

type Props = { children: React.ReactNode };

export default class ErrorBoundary extends React.Component<Props, { hasError: boolean }> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, info: any) {
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-destructive/10 rounded">
          <h3 className="font-semibold text-destructive">Something went wrong</h3>
          <p className="text-sm text-muted-foreground">Unable to load this section. Try refreshing the page.</p>
        </div>
      );
    }

    return this.props.children;
  }
}
