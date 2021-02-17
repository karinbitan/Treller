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

import { connect } from 'react-redux';
import { getLoggedInUser } from './store/actions/authActions';
import { NotificiationMsg } from "./cmps/NotificiationMsg/NotificiationMsg";
import { useEffect, useRef, useState } from "react";
import { socketService } from "./services/socketService";

import './App.scss';

export default function ModalGalleryExample() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export function _App(props) {
  const location = useLocation();
  const background = location.state && location.state.background;

  const [notification, setNotification] = useState({});
  const notificationRef = useRef(notification);

  const loadUser = async () => {
    // await props.getLoggedInUser();
  }

  // socketService.setup();
  // console.log('notification on!')
  // socketService.emit('register user', props.user._id);
  // socketService.on('newNotification', (msg) => {
  //   setNotification(msg)
  // })
  // useEffect(() => {
  //     return () => {
  //       socketService.off('newNotification');
  //     }
  // }, [])
  
  // useEffect(() => {
  //   loadUser();
  // })



  return (
    <section className="App">
      {/* <NotificiationMsg notification={notification} /> */}
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

function mapStateToProps(state) {
  return {
    user: state.userReducer.loggedInUser
  }
}
const mapDispatchToProps = {
  getLoggedInUser
}

export const App = connect(mapStateToProps, mapDispatchToProps)(_App)
