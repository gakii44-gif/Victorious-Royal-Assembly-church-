import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { PhotoProvider } from './context/PhotoContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <PhotoProvider>
      <App />
    </PhotoProvider>
  </ErrorBoundary>
);
