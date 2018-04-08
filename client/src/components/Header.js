import React from "react";
import { NavLink, Link } from "react-router-dom";
import { withCookies, Cookies } from "react-cookie";
import { logout } from "../actions/auth";
import { withRouter } from "react-router";
import { object, shape, string, instanceOf } from "prop-types";
import { ProviderContext, subscribe } from "react-contextual";
import {
  withCallbacksForSession,
  mapSessionContextToProps
} from "../components/context_helper";

class Header extends React.Component {
  static propTypes = {
    history: object.isRequired,
    cookies: instanceOf(Cookies).isRequired,
    user: shape({
      picture: string,
      gravatar: string,
      name: string,
      email: string,
      id: string
    }),
    token: string
  };

  handleLogout(event) {
    event.preventDefault();
    logout({
      history: this.props.history,
      cookies: this.props.cookies,
      ...withCallbacksForSession(this.props)
    });
  }

  render() {
    const active = { borderBottomColor: "#3f51b5" };
    const rightNav = this.props.token ? (
      <ul className="nav navbar-nav navbar-right">
        <li className="dropdown">
          <a
            href="about:blank"
            data-toggle="dropdown"
            className="navbar-avatar dropdown-toggle"
          >
            <img
              alt="avatar"
              src={this.props.user.picture || this.props.user.gravatar}
            />{" "}
            {this.props.user.name ||
              this.props.user.email ||
              this.props.user.id}{" "}
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
