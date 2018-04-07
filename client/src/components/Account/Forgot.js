import React from "react";
import { connect } from "react-redux";
import { forgotPassword } from "../../actions/auth";
import Messages from "../Messages";
import { object, func } from "prop-types";

class Forgot extends React.Component {
  static propTypes = {
    messages: object.isRequired,
    onMount: func,
    onUnmount: func
  };

  constructor(props) {
    super(props);
    this.state = { email: "" };
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

  handleForgot(event) {
    event.preventDefault();
    this.props.dispatch(forgotPassword({ email: this.state.email }));
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

const mapStateToProps = state => {
  return {
    messages: state.messages
  };
};

export default connect(mapStateToProps)(Forgot);
