import React from "react";
import { Link } from "react-router-dom";
import { signup } from "../../actions/auth";
import { object, instanceOf } from "prop-types";
import { withCookies, Cookies } from "react-cookie";
import Messages from "../Messages";
import { ProviderContext, subscribe } from "react-contextual";
import {
  mapMessageContextToProps,
  mapSessionContextToProps,
  messageContextPropType,
  sessionContextPropType
} from "../context_helper";

class Signup extends React.Component {
  static propTypes = {
    history: object.isRequired,
    cookies: instanceOf(Cookies).isRequired,
    ...messageContextPropType,
    ...sessionContextPropType
  };

  constructor(props) {
    super(props);
    this.state = { name: "", email: "", password: "" };
  }

  componentWillUnmount() {
    this.props.messageContext.clearMessages();
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSignup(event) {
    event.preventDefault();
    signup({
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      history: this.props.history,
      cookies: this.props.cookies,
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
            <form onSubmit={this.handleSignup.bind(this)}>
              <legend>Create an account</legend>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Name"
                  autoFocus
                  className="form-control"
                  value={this.state.name}
                  onChange={this.handleChange.bind(this)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Email"
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
                <small className="text-muted">
                  By signing up, you agree to the{" "}
                  <Link to="/">Terms of Service</Link>.
                </small>
              </div>
              <button type="submit" className="btn btn-success">
                Create an account
              </button>
            </form>
          </div>
        </div>
        <p className="text-center">
          Already have an account?{" "}
          <Link to="/login">
            <strong>Log in</strong>
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
  withCookies(Signup)
);
