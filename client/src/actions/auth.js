import moment from "moment";

export function login({ email, password, history, cookies }) {
  return dispatch => {
    dispatch({
      type: "CLEAR_MESSAGES"
    });
    return fetch("/login", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        password: password
      })
    }).then(response => {
      if (response.ok) {
        return response.json().then(json => {
          dispatch({
            type: "LOGIN_SUCCESS",
            token: json.token,
            user: json.user
          });
          cookies.save("token", json.token, {
            expires: moment()
              .add(1, "hour")
              .toDate()
          });
          history.push("/account");
        });
      } else {
        return response.json().then(json => {
          dispatch({
            type: "LOGIN_FAILURE",
            messages: Array.isArray(json) ? json : [json]
          });
        });
      }
    });
  };
}

export function signup({ name, email, password, history, cookies }) {
  return dispatch => {
    dispatch({
      type: "CLEAR_MESSAGES"
    });
    return fetch("/signup", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name, email: email, password: password })
    }).then(response => {
      return response.json().then(json => {
        if (response.ok) {
          dispatch({
            type: "SIGNUP_SUCCESS",
            token: json.token,
            user: json.user
          });
          history.push("/");
          cookies.save("token", json.token, {
            expires: moment()
              .add(1, "hour")
              .toDate()
          });
        } else {
          dispatch({
            type: "SIGNUP_FAILURE",
            messages: Array.isArray(json) ? json : [json]
          });
        }
      });
    });
  };
}

export function logout({ history, cookies }) {
  cookies.remove("token");
  history.push("/");
  return {
    type: "LOGOUT_SUCCESS"
  };
}

export function forgotPassword({ email }) {
  return dispatch => {
    dispatch({
      type: "CLEAR_MESSAGES"
    });
    return fetch("/forgot", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email })
    }).then(response => {
      if (response.ok) {
        return response.json().then(json => {
          dispatch({
            type: "FORGOT_PASSWORD_SUCCESS",
            messages: [json]
          });
        });
      } else {
        return response.json().then(json => {
          dispatch({
            type: "FORGOT_PASSWORD_FAILURE",
            messages: Array.isArray(json) ? json : [json]
          });
        });
      }
    });
  };
}

export function resetPassword({ password, confirm, pathToken, history }) {
  return dispatch => {
    dispatch({
      type: "CLEAR_MESSAGES"
    });
    return fetch(`/reset/${pathToken}`, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        password: password,
        confirm: confirm
      })
    }).then(response => {
      if (response.ok) {
        return response.json().then(json => {
          history.push("/login");
          dispatch({
            type: "RESET_PASSWORD_SUCCESS",
            messages: [json]
          });
        });
      } else {
        return response.json().then(json => {
          dispatch({
            type: "RESET_PASSWORD_FAILURE",
            messages: Array.isArray(json) ? json : [json]
          });
        });
      }
    });
  };
}

export function updateProfile({ state, token }) {
  return dispatch => {
    dispatch({
      type: "CLEAR_MESSAGES"
    });
    return fetch("/account", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        email: state.email,
        name: state.name,
        gender: state.gender,
        location: state.location,
        website: state.website
      })
    }).then(response => {
      if (response.ok) {
        return response.json().then(json => {
          dispatch({
            type: "UPDATE_PROFILE_SUCCESS",
            messages: [json]
          });
        });
      } else {
        return response.json().then(json => {
          dispatch({
            type: "UPDATE_PROFILE_FAILURE",
            messages: Array.isArray(json) ? json : [json]
          });
        });
      }
    });
  };
}

export function changePassword({ password, confirm, token }) {
  return dispatch => {
    dispatch({
      type: "CLEAR_MESSAGES"
    });
    return fetch("/account", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        password: password,
        confirm: confirm
      })
    }).then(response => {
      if (response.ok) {
        return response.json().then(json => {
          dispatch({
            type: "CHANGE_PASSWORD_SUCCESS",
            messages: [json]
          });
        });
      } else {
        return response.json().then(json => {
          dispatch({
            type: "CHANGE_PASSWORD_FAILURE",
            messages: Array.isArray(json) ? json : [json]
          });
        });
      }
    });
  };
}

export function deleteAccount({ token }) {
  return dispatch => {
    dispatch({
      type: "CLEAR_MESSAGES"
    });
    return fetch("/account", {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    }).then(response => {
      if (response.ok) {
        return response.json().then(json => {
          dispatch(logout());
          dispatch({
            type: "DELETE_ACCOUNT_SUCCESS",
            messages: [json]
          });
        });
      }
    });
  };
}
