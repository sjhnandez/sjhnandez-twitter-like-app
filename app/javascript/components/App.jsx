import React, { useState, useEffect } from "react";
import { Route, Switch, withRouter, Redirect } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import SignupModal from "./SignupModal";
import Loading from "./Loading";
import BeginReset from "./PasswordRecovery/BeginReset";
import SendReset from "./PasswordRecovery/SendReset";
import ResetEmailSent from "./PasswordRecovery/ResetEmailSent";
import ResetPassword from "./PasswordRecovery/ResetPassword";
import ResetComplete from "./PasswordRecovery/ResetComplete";
import ConfirmResetPin from "./PasswordRecovery/ConfirmResetPin";
import EditProfileModal from "./EditProfileModal";
import ConfirmPasswordModal from "./TwoFactoAuth/ConfirmationPasswordModal";
import LoginVerification from "./TwoFactoAuth/LoginVerification";

import UserContext from "../contexts/UserContext";
import * as api from "../helpers/Api";
import Dashboard from "./Dashboard";

const App = (props) => {
  const [location, setLocation] = useState(props.location);
  const [authState, setAuthState] = useState({
    user: null,
    reported: false,
  });

  //Check if user is signed in on initial page load
  useEffect(() => {
    api.autoLogin().then((user) => {
      setAuthState({ user, reported: true });
    });
  }, [localStorage.getItem("token")]);

  useEffect(() => {
    if (!(props.location.state && props.location.state.isModal)) {
      setLocation(props.location);
    }
  }, [props.location]);

  const requireLogin = (Component) => {
    if (authState.reported && authState.user) {
      return <Component />;
    } else if (authState.reported) {
      return <Redirect to="/login" />;
    } else {
      return <Loading />;
    }
  };

  return (
    <div>
      <UserContext.Provider value={{ authState, setAuthState }}>
        <Switch location={location}>
          <Route
            exact
            path="/"
            component={() => {
              if (authState.reported && authState.user) {
                return <Redirect to="/home" />;
              } else if (authState.reported) {
                return <Home />;
              } else {
                return <Loading />;
              }
            }}
          />
          <Route
            exact
            path="/login"
            render={() => {
              if (authState.reported && authState.user) {
                return <Redirect to="/home" />;
              } else if (authState.reported) {
                return <Login />;
              } else {
                return <Loading />;
              }
            }}
          />
          <Route exact path="/begin_password_reset" component={BeginReset} />
          <Route exact path="/send_password_reset" component={SendReset} />
          <Route exact path="/reset_email_sent" component={ResetEmailSent} />
          <Route exact path="/reset_password" component={ResetPassword} />
          <Route exact path="/confirm_pin_reset" component={ConfirmResetPin} />
          <Route
            exact
            path="/login_verification"
            component={LoginVerification}
          />

          <Route
            exact
            path="/password_reset_complete"
            component={ResetComplete}
          />
          <Route
            path="/"
            render={() => {
              return requireLogin(Dashboard);
            }}
          />
        </Switch>
        <Route exact path="/signup" component={SignupModal} />
        <Route
          exact
          path="/settings/profile"
          render={() => requireLogin(EditProfileModal)}
        />
        <Route
          exact
          path="/settings/verify_identity"
          render={() => requireLogin(ConfirmPasswordModal)}
        />
      </UserContext.Provider>
    </div>
  );
};

export default withRouter(App);
