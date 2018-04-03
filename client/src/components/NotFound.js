import React from "react";
import { object, func } from "prop-types";

class NotFound extends React.Component {
  static propTypes = {
    history: object.isRequired,
    onUnmount: func
  };

  componentWillUnmount() {
    this.props.onUnmount(this.props.history);
  }

  render() {
    return (
      <div className="container text-center">
        <h1>404</h1>
        <p>Page Not Found</p>
      </div>
    );
  }
}

export default NotFound;
