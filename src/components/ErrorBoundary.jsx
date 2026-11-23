import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('[ugo]', error, info?.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="boot-screen">
          <div style={{ textAlign: 'center', maxWidth: 420, padding: '1.5rem' }}>
            <h1 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>Something went wrong</h1>
            <p style={{ color: 'var(--muted)', marginBottom: '1rem' }}>
              Please refresh the page. If this keeps happening, contact the UGO team.
            </p>
            <button className="btn btn--primary" type="button" onClick={() => window.location.reload()}>
              Refresh
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
