import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import * as Sentry from '@sentry/react';
import App from './App';
import './index.css';
import { TRPCProvider } from './providers/TRPCProvider';
import { AuthProvider } from './contexts/AuthContext';

// Initialize Sentry for frontend error tracking
// Only active in production with VITE_SENTRY_DSN configured
const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;
const IS_PRODUCTION = import.meta.env.PROD;

if (SENTRY_DSN && IS_PRODUCTION) {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: import.meta.env.MODE || 'production',

    // Performance Monitoring
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],

    // Sample rates
    tracesSampleRate: 0.1, // 10% of transactions for performance monitoring
    replaysSessionSampleRate: 0.1, // 10% of sessions
    replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors

    // Filter out development errors
    beforeSend(event) {
      // Don't send events in development
      if (!IS_PRODUCTION) {
        return null;
      }
      return event;
    },
  });

  console.log('✅ Sentry frontend error tracking initialized');
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Sentry.ErrorBoundary
      fallback={({ error, resetError }) => (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '2rem',
          textAlign: 'center',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#dc2626' }}>
            Something went wrong
          </h1>
          <p style={{ marginBottom: '2rem', color: '#6b7280', maxWidth: '500px' }}>
            We've been notified about this error and will fix it as soon as possible.
          </p>
          <details style={{ marginBottom: '2rem', textAlign: 'left', maxWidth: '600px' }}>
            <summary style={{ cursor: 'pointer', marginBottom: '1rem', fontWeight: 'bold' }}>
              Error Details
            </summary>
            <pre style={{
              background: '#f3f4f6',
              padding: '1rem',
              borderRadius: '0.5rem',
              overflow: 'auto',
              fontSize: '0.875rem'
            }}>
              {error?.toString()}
            </pre>
          </details>
          <button
            onClick={resetError}
            style={{
              background: '#3b82f6',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              border: 'none',
              fontSize: '1rem',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            Try Again
          </button>
        </div>
      )}
      showDialog
    >
      <BrowserRouter>
        <TRPCProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </TRPCProvider>
      </BrowserRouter>
    </Sentry.ErrorBoundary>
  </React.StrictMode>,
);
