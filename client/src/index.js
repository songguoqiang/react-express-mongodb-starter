import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import App from "./components/App";
import Home from "./components/Home";
import NotFound from "./components/NotFound";
import Login from "./components/Account/Login";
import Signup from "./components/Account/Signup";
import Profile from "./components/Account/Profile";
import Forgot from "./components/Account/Forgot";
import Reset from "./components/Account/Reset";
import registerServiceWorker from "./registerServiceWorker";

import "whatwg-fetch";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/css/bootstrap-theme.css";
import "./index.css";

import { Provider, subscribe } from "react-contextual";

const store = {
  initialState: { jwtToken: null, user: {}, messages: {} },
  actions: {
    saveSession: (jwtToken, user) => ({ jwtToken, user }),
    clearSession: () => ({ jwtToken: null, user: {} }),
    clearMessages: () => ({ messages: {} }),
    setErrorMessages: errors => ({ messages: { error: errors } }),
    setSuccessMessages: success => ({ messages: { success: success } })
  }
};

const isAuthenticated = props => props.jwtToken !== null;

const PrivateRoute = subscribe()(({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isAuthenticated(props) ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/login",
            state: { from: props.location }
          }}
        />
      )
    }
  />
));

ReactDOM.render(
  <Provider {...store}>
    <BrowserRouter>
      <App>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
          <PrivateRoute path="/account" component={Profile} />
          <Route path="/forgot" component={Forgot} />
          <Route path="/reset/:token" component={Reset} />
          <Route path="*" component={NotFound} />
        </Switch>
      </App>
    </BrowserRouter>
  </Provider>,
  document.getElementById("app")
);

registerServiceWorker();
