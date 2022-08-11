import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:3001/api';
var Auth_Token = localStorage.getItem("token");
// axios.defaults.headers.common['Authorization'] = Auth_Token;
//check sentry
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

    <App />
  
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
