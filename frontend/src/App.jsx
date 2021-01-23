import { HashRouter as Router, Route, Switch } from 'react-router-dom';

import { HomePage } from './pages/HomePage';
import { TrellerApp } from './pages/TrellerApp/TrellerApp';
import { MainHeader } from './cmps/MainHeader/MainHeader';
import { CardDetails } from './pages/CardDetails';

import './App.scss';
import { UserProfile } from './pages/UserProfile/UserProfile';
import { Login } from './pages/Login';

function App() {
  return (
    <section className="App">
      <Router>
        <MainHeader />
          <Switch>
            <Route exact component={CardDetails} path="/treller/card/:id"></Route>
            <Route exact component={TrellerApp} path="/treller/board/:id"></Route>
            <Route exact component={UserProfile} path="/user/:id"></Route>
            <Route exact component={Login} path="/login"></Route>
            <Route exact component={HomePage} path="/"></Route>
          </Switch>
      </Router>
    </section >
  );
}

export default App;
