import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import App from './App';
import AutorBox from './Autor';
import Home from './Home';
import LivroBox from './Livro';

const routes = (
  <App>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/autor" component={AutorBox} />
      <Route path="/livro" component={LivroBox} />
    </Switch>
  </App>
);

ReactDOM.render(
  (
    <Router>
      {routes}
    </Router>
  ),
  document.getElementById('root')
);