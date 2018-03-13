import React from 'react'
import ReactDOM from 'react-dom'
import { Router } from 'react-router-dom'

import history from './history';
import App from './components/App.jsx'

import Auth from './Auth/Auth';
const auth = new Auth();

import './css/style.scss'


ReactDOM.render((
  <Router history={history}>
    <App auth={auth}/>
  </Router>
), document.getElementById('root'));