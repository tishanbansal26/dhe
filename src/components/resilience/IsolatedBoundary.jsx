import React from 'react';
import ComponentFallback from './ComponentFallback';
import { telemetry } from '../../lib/observability/telemetry';

export default class IsolatedBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    telemetry.recordLog('ERROR', `Isolated Component Failure: ${this.props.name || 'AnonymousComponent'}`, {
      error: error?.message || String(error),
      stack: errorInfo?.componentStack
    });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onRetry) {
      this.props.onRetry();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return typeof this.props.fallback === 'function' 
          ? this.props.fallback(this.handleRetry) 
          : this.props.fallback;
      }

      return (
        <ComponentFallback
          componentName={this.props.name || 'This section'}
          message={this.props.customMessage}
          onRetry={this.handleRetry}
          actionLabel={this.props.actionLabel}
          actionUrl={this.props.actionUrl}
        />
      );
    }

    return this.props.children;
  }
}
