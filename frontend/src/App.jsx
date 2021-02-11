// import { BrowserRouter as Router, Route, Switch, useLocation, } from 'react-router-dom';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useLocation,
} from "react-router-dom";

import { HomePage } from './pages/HomePage';
import { TrellerApp } from './pages/TrellerApp/TrellerApp';
import { CardDetails } from './pages/CardDetails';
import { UserProfile } from './pages/UserProfile/UserProfile';
import { Login } from './pages/Login';
import { Boards } from './pages/Boards/Boards';

import './App.scss';

export default function ModalGalleryExample() {
  return (
    <Router>
      <App />
    </Router>
  );
}

function App() {
  const location = useLocation();
  const background = location.state && location.state.background;

  return (
    <section className="App">
        <Switch location={background || location}>
          <Route exact component={HomePage} path="/"></Route>
          <Route component={Login} path="/login"></Route>
          <Route component={Boards} path="/user/:id/boards"></Route>
          <Route component={UserProfile} path="/user/:id"></Route>
          <Route component={TrellerApp} path="/treller/board/:id"></Route>
          <Route component={CardDetails} path="/treller/card/:id"></Route>
        </Switch>
        {background && <Route component={CardDetails} path="/treller/card/:id"></Route>}
    </section >
  );
}

// export default App;
