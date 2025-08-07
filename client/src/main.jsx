import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { initializeApp } from './app/slices/taskSlice';

window.addEventListener('online', () => {
  store.dispatch(initializeApp());
});
window.addEventListener('offline', () => {
  store.dispatch({ type: 'tasks/setNetworkStatus', payload: false });
});

store.dispatch(initializeApp());

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);