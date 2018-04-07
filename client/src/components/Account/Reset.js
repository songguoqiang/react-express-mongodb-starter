import React from "react";
import { connect } from "react-redux";
import { resetPassword } from "../../actions/auth";
import Messages from "../Messages";
import { object, shape, string, func } from "prop-types";

class Reset extends React.Component {
  static propTypes = {
    history: object.isRequired,
    params: shape({
      token: string.isRequired
    }).isRequired,
    messages: object.isRequired,
    onMount: func,
    onUnmount: func
  };

  constructor(props) {
    super(props);
    this.state = { password: "", confirm: "" };
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

  handleReset(event) {
    event.preventDefault();
    this.props.dispatch(
      resetPassword({
        password: this.state.password,
        confirm: this.state.confirm,
        token: this.props.match.params.token,
        history: this.props.history
      })
    );
  }

  render() {
    return (
      <div className="container">
        <div className="panel">
          <div className="panel-body">
            <Messages messages={this.props.messages} />
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

const mapStateToProps = state => {
  return state;
};

export default connect(mapStateToProps)(Reset);
