export function login({ email, password, history, from }) {
  return dispatch => {
    dispatch({
      type: "CLEAR_MESSAGES"
    });
    return fetch("/api/users/login", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user: {
          email: email,
          password: password
        }
      })
    }).then(response => {
      if (response.ok) {
        return response.json().then(json => {
          dispatch({
            type: "LOGIN_SUCCESS",
            token: json.token,
            user: json.user
          });
          history.replace(from);
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

export function signup({ name, email, password, history }) {
  return dispatch => {
    dispatch({
      type: "CLEAR_MESSAGES"
    });
    return fetch("/api/users/signup", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user: {
          name: name,
          email: email,
          password: password
        }
      })
    }).then(response => {
      return response.json().then(json => {
        if (response.ok) {
          dispatch({
            type: "SIGNUP_SUCCESS",
            token: json.token,
            user: json.user
          });
          history.push("/");
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

export function logout({ history }) {
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
    return fetch("/api/user/forgot-password", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user: { email: email } })
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

export function resetPassword({ password, confirm, token, history }) {
  return dispatch => {
    dispatch({
      type: "CLEAR_MESSAGES"
    });
    if (password !== confirm) {
      dispatch({
        type: "RESET_PASSWORD_FAILURE",
        messages: [
          { msg: "Your confirmed password does not match the new password" }
        ]
      });
    } else {
      return fetch(`/api/user/reset-password/${token}`, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: {
            password: password,
            confirm: confirm
          }
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
    }
  };
}

export function updateProfile({ state, token }) {
  return dispatch => {
    dispatch({
      type: "CLEAR_MESSAGES"
    });
    return fetch("/api/user", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        user: {
          email: state.email,
          name: state.name
        }
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

    if (password !== confirm) {
      dispatch({
        type: "CHANGE_PASSWORD_FAILURE",
        messages: [
          { msg: "Your confirmed password does not match the new password" }
        ]
      });
    } else {
      return fetch("/api/user", {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          user: {
            password: password,
            confirm: confirm
          }
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
    }
  };
}

export function deleteAccount({ history, token }) {
  return dispatch => {
    dispatch({
      type: "CLEAR_MESSAGES"
    });
    return fetch("/api/user", {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    }).then(response => {
      if (response.ok) {
        return response.json().then(json => {
          dispatch(logout({ history }));
          dispatch({
            type: "DELETE_ACCOUNT_SUCCESS",
            messages: [json]
          });
        });
      } else {
        return response.json().then(json => {
          dispatch({
            type: "DELETE_ACCOUNT_FAILURE",
            messages: Array.isArray(json) ? json : [json]
          });
        });
      }
    });
  };
}
