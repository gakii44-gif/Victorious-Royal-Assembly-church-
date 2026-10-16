import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { PhotoProvider } from './context/PhotoContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <PhotoProvider>
    <App />
  </PhotoProvider>
);
