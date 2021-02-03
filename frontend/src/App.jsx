import { HashRouter as Router, Route, Switch } from 'react-router-dom';

import { HomePage } from './pages/HomePage';
import { TrellerApp } from './pages/TrellerApp/TrellerApp';
import { UserProfile } from './pages/UserProfile/UserProfile';
import { Login } from './pages/Login';
import { Boards } from './pages/Boards/Boards';

import './App.scss';

function App() {
  return (
    <section className="App">
      <Router>
        <Switch>
          <Route exact component={TrellerApp} path="/treller/board/:id"></Route>
          <Route exact component={Boards} path="/user/:id/boards"></Route>
          <Route exact component={UserProfile} path="/user/:id"></Route>
          <Route exact component={Login} path="/login"></Route>
          <Route exact component={HomePage} path="/"></Route>
        </Switch>
      </Router>
    </section >
  );
}

export default App;
