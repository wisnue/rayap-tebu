import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './styles/shadows.css';
import './styles/responsive.css';
import './styles/performance.css';
import './styles/ui-updates.css';
import './styles/ui-updates-v2.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
