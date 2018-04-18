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

import { Provider } from "react-contextual";

class App extends React.Component {
  isAuthenticated = false;
  saveSession = (jwtToken, user) => {
    this.isAuthenticated = true;
    return { jwtToken, user };
  };

  clearSession = () => {
    this.isAuthenticated = false;
    return { jwtToken: null, user: {} };
  };

  store = {
    initialState: { jwtToken: null, user: {}, messages: {} },
    actions: {
      saveSession: this.saveSession,
      clearSession: this.clearSession,
      updateUserProfile: newProfile => state => ({
        user: Object.assign(state.user, newProfile)
      }),
      clearMessages: () => ({ messages: {} }),
      setErrorMessages: errors => ({ messages: { error: errors } }),
      setSuccessMessages: success => ({ messages: { success: success } })
    }
  };

  PrivateRoute = ({ component: Component, ...rest }) => (
    <Route
      {...rest}
      render={props =>
        this.isAuthenticated ? (
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
  );

  render() {
    return (
      <Provider {...this.store}>
        <CookiesProvider>
          <BrowserRouter>
            <div>
              <Header />
              <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/login" component={Login} />
                <Route path="/signup" component={Signup} />
                <this.PrivateRoute path="/account" component={Profile} />
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
