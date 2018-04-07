import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import App from "./components/App";
import Home from "./components/Home";
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

const clearMessages = () => {
  store.dispatch({
    type: "CLEAR_MESSAGES"
  });
};

const isAuthenticated = () => store.getState().auth.token;

const PrivateRoute = ({ render, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isAuthenticated() ? (
        render(props)
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
);

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
            path="/login"
            render={props => <Login {...props} onUnmount={clearMessages} />}
          />
          <Route
            path="/signup"
            render={props => <Signup {...props} onUnmount={clearMessages} />}
          />
          <PrivateRoute
            path="/account"
            render={props => <Profile {...props} onUnmount={clearMessages} />}
          />
          <Route
            path="/forgot"
            render={props => <Forgot {...props} onUnmount={clearMessages} />}
          />
          <Route
            path="/reset/:token"
            render={props => <Reset {...props} onUnmount={clearMessages} />}
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
