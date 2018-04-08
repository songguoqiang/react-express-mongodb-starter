import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { CookiesProvider } from "react-cookie";
import Header from "./Header";
import Footer from "./Footer";
import Home from "./Home";
import NotFound from "./NotFound";
import Login from "./Account/Login";
import Signup from "./Account/Signup";
import Profile from "./Account/Profile";
import Forgot from "./Account/Forgot";
import Reset from "./Account/Reset";

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

class App extends React.Component {
  render() {
    return (
      <Provider {...store}>
        <CookiesProvider>
          <BrowserRouter>
            <div>
              <Header />
              <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/login" component={Login} />
                <Route path="/signup" component={Signup} />
                <PrivateRoute path="/account" component={Profile} />
                <Route path="/forgot" component={Forgot} />
                <Route path="/reset/:token" component={Reset} />
                <Route path="*" component={NotFound} />
              </Switch>
              <Footer />
            </div>
          </BrowserRouter>
        </CookiesProvider>
      </Provider>
    );
  }
}

export default App;
