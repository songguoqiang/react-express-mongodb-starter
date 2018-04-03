import React from "react";
import { object } from "prop-types";

class Messages extends React.Component {
  static propTypes = {
    messages: object.isRequired
  };

  render() {
    return this.props.messages.success ? (
      <div role="alert" className="alert alert-success">
        {this.props.messages.success.map((message, index) => (
          <div key={index}>{message.msg}</div>
        ))}
      </div>
    ) : this.props.messages.error ? (
      <div role="alert" className="alert alert-danger">
        {this.props.messages.error.map((message, index) => (
          <div key={index}>{message.msg}</div>
        ))}
      </div>
    ) : this.props.messages.info ? (
      <div role="alert" className="alert alert-info">
        {this.props.messages.info.map((message, index) => (
          <div key={index}>{message.msg}</div>
        ))}
      </div>
    ) : null;
  }
}

export default Messages;
