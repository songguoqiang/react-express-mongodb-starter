import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { login } from "../../actions/auth";
import Messages from "../Messages";
import { object, func } from "prop-types";

class Login extends React.Component {
  static propTypes = {
    history: object.isRequired,
    messages: object.isRequired,
    onMount: func,
    onUnmount: func
  };

  constructor(props) {
    super(props);
    this.state = { email: "", password: "" };
  }

  componentDidMount() {
    if (this.props.onMount) {
      this.props.onMount(this.props.history);
    }
  }

  componentWillUnmount() {
    if (this.props.onUnmount) {
      this.props.onUnmount(this.props.history);
    }
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
    this.props.dispatch(
      login({
        email: this.state.email,
        password: this.state.password,
        history: this.props.history,
        from: this.getRedirectReferer()
      })
    );
  }

  render() {
    return (
      <div className="login-container container">
        <div className="panel">
          <div className="panel-body">
            <Messages messages={this.props.messages} />
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

const mapStateToProps = state => {
  return {
    messages: state.messages
  };
};

export default connect(mapStateToProps)(Login);
