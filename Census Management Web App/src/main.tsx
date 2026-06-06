import { StrictMode, Component, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.css';
import App from './app/App';
import { AuthProvider } from './app/Context/AuthContext';

// Global error boundary — catches any render crash and shows a message instead of white screen
class ErrorBoundary extends Component<{ children: ReactNode }, { error: string | null }> {
  state = { error: null };
  static getDerivedStateFromError(e: Error) { return { error: e.message }; }
  render() {
    if (this.state.error) {
      return (
        <div style={{ fontFamily: 'sans-serif', padding: 40, textAlign: 'center', background: '#f9fafb', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'white', borderRadius: 16, padding: 40, maxWidth: 500, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
            <h2 style={{ color: '#0D1B4B', marginBottom: 8 }}>Something went wrong</h2>
            <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 24 }}>{this.state.error}</p>
            <button
              onClick={() => { localStorage.clear(); window.location.href = '/login'; }}
              style={{ background: '#0D1B4B', color: 'white', border: 'none', borderRadius: 12, padding: '12px 24px', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>
              Clear Cache &amp; Go to Login
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ErrorBoundary>
  </StrictMode>
);
