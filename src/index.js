import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

ReactDOM.render(
<BrowserRouter>
    <Switch>
        <Route exact path="/" component={App} />
        <Route path="/autor" />
        <Route path="/livro" />
    </Switch>
</BrowserRouter>,
document.getElementById('root'));
