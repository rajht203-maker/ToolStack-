import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Register service worker for offline asset caching and instant loading
if (typeof window !== 'undefined') {
  registerSW({
    immediate: true,
    onNeedRefresh() {
      console.log('New content available, cache refreshed.');
    },
    onOfflineReady() {
      console.log('ToolStack assets cached for offline operation.');
    },
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
