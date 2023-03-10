import React from 'react';

interface ErrorBoundaryProps {
  fallback: React.ReactNode;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, { hasError: boolean; }> {
  constructor(props: ErrorBoundaryProps) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  componentDidCatch() {
    this.setState({
      hasError: true,
    });
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}
