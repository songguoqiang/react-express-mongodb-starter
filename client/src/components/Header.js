import React from "react";
import { NavLink, Link } from "react-router-dom";
import { withCookies, Cookies } from "react-cookie";
import { logout } from "../actions/auth";
import { withRouter } from "react-router";
import { object, instanceOf } from "prop-types";
import { ProviderContext, subscribe } from "react-contextual";
import {
  mapSessionContextToProps,
  sessionContextPropType
} from "../components/context_helper";

class Header extends React.Component {
  static propTypes = {
    history: object.isRequired,
    cookies: instanceOf(Cookies).isRequired,
    ...sessionContextPropType
  };

  handleLogout(event) {
    event.preventDefault();
    logout({
      history: this.props.history,
      cookies: this.props.cookies,
      sessionContext: this.props.sessionContext
    });
  }

  render() {
    const active = { borderBottomColor: "#3f51b5" };
    const rightNav = this.props.sessionContext.token ? (
      <ul className="nav navbar-nav navbar-right">
        <li className="dropdown">
          <a
            href="about:blank"
            data-toggle="dropdown"
            className="navbar-avatar dropdown-toggle"
          >
            <img
              alt="avatar"
              src={
                this.props.sessionContext.user.picture ||
                this.props.sessionContext.user.gravatar
              }
            />{" "}
            {this.props.sessionContext.user.name ||
              this.props.sessionContext.user.email ||
              this.props.sessionContext.user.id}{" "}
            <i className="caret" />
          </a>
          <ul className="dropdown-menu">
            <li>
              <Link to="/account">My Account</Link>
            </li>
            <li className="divider" />
            <li>
              <a href="about:blank" onClick={this.handleLogout.bind(this)}>
                Logout
              </a>
            </li>
          </ul>
        </li>
      </ul>
    ) : (
      <ul className="nav navbar-nav navbar-right">
        <li>
          <NavLink to="/login" activeStyle={active}>
            Log in
          </NavLink>
        </li>
        <li>
          <NavLink to="/signup" activeStyle={active}>
            Sign up
          </NavLink>
        </li>
      </ul>
    );
    return (
      <nav className="navbar navbar-default navbar-static-top">
        <div className="container">
          <div className="navbar-header">
            <button
              type="button"
              data-toggle="collapse"
              data-target="#navbar"
              className="navbar-toggle collapsed"
            >
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar" />
              <span className="icon-bar" />
              <span className="icon-bar" />
            </button>
            <NavLink exact to="/" className="navbar-brand">
              Project name
            </NavLink>
          </div>
          <div id="navbar" className="navbar-collapse collapse">
            <ul className="nav navbar-nav">
              <li>
                <NavLink exact to="/" activeStyle={active}>
                  Home
                </NavLink>
              </li>
            </ul>
            {rightNav}
          </div>
        </div>
      </nav>
    );
  }
}

const mapContextToProps = context => {
  return mapSessionContextToProps(context);
};

export default withRouter(
  subscribe(ProviderContext, mapContextToProps)(withCookies(Header))
);
