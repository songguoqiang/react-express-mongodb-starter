import React from "react";
import { forgotPassword } from "../../actions/auth";
import Messages from "../Messages";
import { object } from "prop-types";
import { ProviderContext, subscribe } from "react-contextual";
import {
  withCallbacksForMessages,
  mapMessageContextToProps
} from "../context_helper";

class Forgot extends React.Component {
  static propTypes = {
    messages: object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = { email: "" };
  }

  componentWillUnmount() {
    this.props.clearMessages();
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleForgot(event) {
    event.preventDefault();
    forgotPassword({
      email: this.state.email,
      ...withCallbacksForMessages(this.props)
    });
  }

  render() {
    return (
      <div className="container">
        <div className="panel">
          <div className="panel-body">
            <Messages messages={this.props.messages} />
            <form onSubmit={this.handleForgot.bind(this)}>
              <legend>Forgot Password</legend>
              <div className="form-group">
                <p>
                  Enter your email address below and we'll send you password
                  reset instructions.
                </p>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Email"
                  className="form-control"
                  autoFocus
                  value={this.state.email}
                  onChange={this.handleChange.bind(this)}
                />
              </div>
              <button type="submit" className="btn btn-success">
                Reset Password
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

const mapContextToProps = context => {
  return mapMessageContextToProps(context);
};

export default subscribe(ProviderContext, mapContextToProps)(Forgot);
