import React from "react";
import { Link } from "react-router-dom";
import { withCookies, Cookies } from "react-cookie";
import { login } from "../../actions/auth";
import Messages from "../Messages";
import { object, instanceOf } from "prop-types";
import { ProviderContext, subscribe } from "react-contextual";
import {
  mapMessageContextToProps,
  mapSessionContextToProps,
  messageContextPropType,
  sessionContextPropType
} from "../context_helper";

class Login extends React.Component {
  static propTypes = {
    history: object.isRequired,
    cookies: instanceOf(Cookies).isRequired,
    ...messageContextPropType,
    ...sessionContextPropType
  };

  constructor(props) {
    super(props);
    this.state = { email: "", password: "" };
  }

  componentWillUnmount() {
    this.props.messageContext.clearMessages();
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  getRedirectReferer() {
    let locationState = this.props.location.state;
    if (locationState && locationState.from) {
      return locationState.from.pathname;
    } else {
      return "/";
    }
  }

  handleLogin(event) {
    event.preventDefault();
    login({
      email: this.state.email,
      password: this.state.password,
      history: this.props.history,
      cookies: this.props.cookies,
      from: this.getRedirectReferer(),
      messageContext: this.props.messageContext,
      sessionContext: this.props.sessionContext
    });
  }

  render() {
    return (
      <div className="login-container container">
        <div className="panel">
          <div className="panel-body">
            <Messages messages={this.props.messageContext.messages} />
            <form onSubmit={this.handleLogin.bind(this)}>
              <legend>Log In</legend>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Email"
                  autoFocus
                  className="form-control"
                  value={this.state.email}
                  onChange={this.handleChange.bind(this)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Password"
                  className="form-control"
                  value={this.state.password}
                  onChange={this.handleChange.bind(this)}
                />
              </div>
              <div className="form-group">
                <Link to="/forgot">
                  <strong>Forgot your password?</strong>
                </Link>
              </div>
              <button type="submit" className="btn btn-success">
                Log in
              </button>
            </form>
          </div>
        </div>
        <p className="text-center">
          Don't have an account?{" "}
          <Link to="/signup">
            <strong>Sign up</strong>
          </Link>
        </p>
      </div>
    );
  }
}

const mapContextToProps = context => {
  return {
    ...mapSessionContextToProps(context),
    ...mapMessageContextToProps(context)
  };
};

export default subscribe(ProviderContext, mapContextToProps)(
  withCookies(Login)
);
