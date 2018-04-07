import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { signup } from "../../actions/auth";
import { object, func } from "prop-types";
import Messages from "../Messages";

class Signup extends React.Component {
  static propTypes = {
    history: object.isRequired,
    messages: object.isRequired,
    onMount: func,
    onUnmount: func
  };

  constructor(props) {
    super(props);
    this.state = { name: "", email: "", password: "" };
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

  handleSignup(event) {
    event.preventDefault();
    this.props.dispatch(
      signup({
        name: this.state.name,
        email: this.state.email,
        password: this.state.password,
        history: this.props.history
      })
    );
  }

  render() {
    return (
      <div className="login-container container">
        <div className="panel">
          <div className="panel-body">
            <Messages messages={this.props.messages} />
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

const mapStateToProps = state => {
  return {
    messages: state.messages
  };
};

export default connect(mapStateToProps)(Signup);
