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
// import { NotificiationMsg } from "./cmps/NotificiationMsg/NotificiationMsg";
import { useEffect } from "react";
// import { socketService } from "./services/socketService";

import './App.scss';
import { eventBus } from "./services/eventBusService";

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

  // const notificationRef = useRef(notification);

  const loadUser = async () => {
    await props.getLoggedInUser();
  }

  // useEffect( () => {
  //  loadUser();
  // }, [])

  useEffect(() => {
    eventBus.on('loadUser', ()=>{
      loadUser();
  })

    // const { user } = props;
    // socketService.setup();
    // socketService.emit('register user', user._id);
    // socketService.on('newNotification', (msg) => {
    //   // setNotification(msg)
    //   console.log(msg)
    // });

    // return () => {
    //   socketService.off('newNotification')
    // };
  });

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
