import React from "react";
import { object } from "prop-types";

class NotFound extends React.Component {
  static propTypes = {
    history: object.isRequired
  };

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
