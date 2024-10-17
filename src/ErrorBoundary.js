import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state to display fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can log error information to an external service here
    console.error("Error caught in ErrorBoundary: ", error, errorInfo);
  }

  // Retry handler to reset the error state and attempt re-rendering
  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h1>Oops, something went wrong.</h1>
          <button onClick={this.handleRetry}>Try Again</button>
        </div>
      );
    }

    return this.props.children; // If no error, render child components
  }
}

export default ErrorBoundary;
