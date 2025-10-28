import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { TRPCProvider } from './providers/TRPCProvider';
import { AuthProvider } from './contexts/AuthContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TRPCProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </TRPCProvider>
  </React.StrictMode>,
);
