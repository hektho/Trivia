import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import Game from './pages/Game';
import Login from './pages/Login';
import Settings from './pages/Settings';
import Expired from './pages/Expired';
import Feedback from './pages/Feedback';
import Ranking from './pages/Ranking';

class App extends Component {
  render() {
    return (
      <Switch>
        <Route exact path='/' component={ Login } />
        <Route exact path='/settings' component={ Settings } />
        <Route exact path='/game' component={ Game } />
        <Route exact path='/expired' component={ Expired } />
        <Route exact path='/feedback' component={ Feedback } />
        <Route exact path='/ranking' component={ Ranking } />
        {/* <Route component={ NotFound } /> */}
      </Switch>
    );
  }
}

export default App;
