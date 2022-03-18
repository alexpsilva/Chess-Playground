import React from 'react';
import ReactDOM from 'react-dom';
import { store } from './redux/store'
import { Provider } from 'react-redux';
import App from './app';
import './index.css';
// import reportWebVitals from './report-web-vitals';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// Uncomment to measure performance
// reportWebVitals(console.log)