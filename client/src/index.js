import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import App from "./components/App";
import Home from "./components/Home";
import Contact from "./components/Contact";
import NotFound from "./components/NotFound";
import Login from "./components/Account/Login";
import Signup from "./components/Account/Signup";
import Profile from "./components/Account/Profile";
import Forgot from "./components/Account/Forgot";
import Reset from "./components/Account/Reset";

import configureStore from "./store/configureStore";
import registerServiceWorker from "./registerServiceWorker";

import "whatwg-fetch";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/css/bootstrap-theme.css";
import "./index.css";

const store = configureStore(window.INITIAL_STATE);

const ensureAuthenticated = history => {
  if (!store.getState().auth.token) {
    history.replace("/login");
  }
};
const skipIfAuthenticated = history => {
  if (store.getState().auth.token) {
    history.replace("/");
  }
};
const clearMessages = () => {
  store.dispatch({
    type: "CLEAR_MESSAGES"
  });
};

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App>
        <Switch>
          <Route
            path="/"
            exact
            render={props => <Home {...props} onUnmount={clearMessages} />}
          />
          <Route
            path="/contact"
            render={props => <Contact {...props} onUnmount={clearMessages} />}
          />
          <Route
            path="/login"
            render={props => (
              <Login
                {...props}
                onMount={skipIfAuthenticated}
                onUnmount={clearMessages}
              />
            )}
          />
          <Route
            path="/signup"
            render={props => (
              <Signup
                {...props}
                onMount={skipIfAuthenticated}
                onUnmount={clearMessages}
              />
            )}
          />
          <Route
            path="/account"
            render={props => (
              <Profile
                {...props}
                onMount={ensureAuthenticated}
                onUnmount={clearMessages}
              />
            )}
          />
          <Route
            path="/forgot"
            render={props => (
              <Forgot
                {...props}
                onMount={skipIfAuthenticated}
                onUnmount={clearMessages}
              />
            )}
          />
          <Route
            path="/reset/:token"
            render={props => (
              <Reset
                {...props}
                onMount={skipIfAuthenticated}
                onUnmount={clearMessages}
              />
            )}
          />
          <Route
            path="*"
            render={props => <NotFound {...props} onUnmount={clearMessages} />}
          />
        </Switch>
      </App>
    </BrowserRouter>
  </Provider>,
  document.getElementById("app")
);

registerServiceWorker();
