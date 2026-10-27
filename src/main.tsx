import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Register Service Worker for offline capability
const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('New Medical Learning Hub content available.');
  },
  onOfflineReady() {
    console.log('Medical Learning Hub is now ready for offline study.');
  },
});

createRoot(document.getElementById('root')!).render(<App />);

