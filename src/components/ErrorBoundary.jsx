import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('Kitchen Designer error:', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            background: '#0f1020',
            color: '#fff',
            fontFamily: 'sans-serif',
            padding: '2rem',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
          <h2 style={{ marginBottom: '0.5rem', color: '#ff6b6b' }}>Something went wrong</h2>
          <p style={{ color: '#888', maxWidth: '400px', marginBottom: '1rem' }}>
            The 3D renderer encountered an error. This usually happens if your browser
            does not support WebGL or hardware acceleration is disabled.
          </p>
          <pre
            style={{
              background: '#1e2030',
              padding: '1rem',
              borderRadius: '8px',
              fontSize: '0.75rem',
              color: '#ff9a9a',
              maxWidth: '600px',
              overflow: 'auto',
              textAlign: 'left',
            }}
          >
            {this.state.error.message}
          </pre>
          <button
            onClick={() => this.setState({ error: null })}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1.5rem',
              background: '#3a7bd5',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.875rem',
            }}
          >
            Try again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
