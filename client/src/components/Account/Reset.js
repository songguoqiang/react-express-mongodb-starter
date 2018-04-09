import React from "react";
import { resetPassword } from "../../actions/auth";
import Messages from "../Messages";
import { object, shape, string } from "prop-types";
import { ProviderContext, subscribe } from "react-contextual";
import {
  mapMessageContextToProps,
  messageContextPropType
} from "../context_helper";

class Reset extends React.Component {
  static propTypes = {
    history: object.isRequired,
    params: shape({
      token: string.isRequired
    }).isRequired,
    ...messageContextPropType
  };

  constructor(props) {
    super(props);
    this.state = { password: "", confirm: "" };
  }

  componentWillUnmount() {
    this.props.messageContext.clearMessages();
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleReset(event) {
    event.preventDefault();
    resetPassword({
      password: this.state.password,
      confirm: this.state.confirm,
      token: this.props.match.params.token,
      history: this.props.history,
      messageContext: this.props.messageContext
    });
  }

  render() {
    return (
      <div className="container">
        <div className="panel">
          <div className="panel-body">
            <Messages messages={this.props.messageContext.messages} />
            <form onSubmit={this.handleReset.bind(this)}>
              <legend>Reset Password</legend>
              <div className="form-group">
                <label htmlFor="password">New Password</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="New password"
                  className="form-control"
                  autoFocus
                  value={this.state.password}
                  onChange={this.handleChange.bind(this)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirm">Confirm Password</label>
                <input
                  type="password"
                  name="confirm"
                  id="confirm"
                  placeholder="Confirm password"
                  className="form-control"
                  value={this.state.confirm}
                  onChange={this.handleChange.bind(this)}
                />
              </div>
              <div className="form-group">
                <button type="submit" className="btn btn-success">
                  Change Password
                </button>
              </div>
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

export default subscribe(ProviderContext, mapContextToProps)(Reset);
