export function login({
  email,
  password,
  history,
  from,
  clearMessages,
  saveSession,
  setErrorMessages
}) {
  clearMessages();
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
        saveSession(json.token, json.user);
        history.replace(from);
      });
    } else {
      return response.json().then(json => {
        const messages = Array.isArray(json) ? json : [json];
        setErrorMessages(messages);
      });
    }
  });
}

export function signup({
  name,
  email,
  password,
  history,
  clearMessages,
  setErrorMessages,
  saveSession
}) {
  clearMessages();
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
        saveSession(json.token, json.user);
        history.push("/");
      } else {
        const messages = Array.isArray(json) ? json : [json];
        setErrorMessages(messages);
      }
    });
  });
}

export function logout({ history, clearSession }) {
  clearSession();
  history.push("/");
}

export function forgotPassword({
  email,
  clearMessages,
  setSuccessMessages,
  setErrorMessages
}) {
  clearMessages();
  return fetch("/api/user/forgot-password", {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user: { email: email } })
  }).then(response => {
    if (response.ok) {
      return response.json().then(json => {
        setSuccessMessages([json]);
      });
    } else {
      return response.json().then(json => {
        const messages = Array.isArray(json) ? json : [json];
        setErrorMessages(messages);
      });
    }
  });
}

export function resetPassword({
  password,
  confirm,
  token,
  history,
  clearMessages,
  setSuccessMessages,
  setErrorMessages
}) {
  clearMessages();
  if (password !== confirm) {
    const messages = [
      { msg: "Your confirmed password does not match the new password" }
    ];
    setErrorMessages(messages);
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
          setSuccessMessages([json]);
        });
      } else {
        return response.json().then(json => {
          const messages = Array.isArray(json) ? json : [json];
          setErrorMessages(messages);
        });
      }
    });
  }
}

export function updateProfile({
  state,
  token,
  clearMessages,
  setSuccessMessages,
  setErrorMessages
}) {
  clearMessages();
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
        setSuccessMessages([json]);
      });
    } else {
      return response.json().then(json => {
        const messages = Array.isArray(json) ? json : [json];
        setErrorMessages(messages);
      });
    }
  });
}

export function changePassword({
  password,
  confirm,
  token,
  clearMessages,
  setSuccessMessages,
  setErrorMessages
}) {
  clearMessages();
  if (password !== confirm) {
    const messages = [
      { msg: "Your confirmed password does not match the new password" }
    ];
    setErrorMessages(messages);
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
          setSuccessMessages([json]);
        });
      } else {
        return response.json().then(json => {
          const messages = Array.isArray(json) ? json : [json];
          setErrorMessages(messages);
        });
      }
    });
  }
}

export function deleteAccount({
  history,
  token,
  clearMessages,
  clearSession,
  setSuccessMessages,
  setErrorMessages
}) {
  clearMessages();
  return fetch("/api/user", {
    method: "delete",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  }).then(response => {
    if (response.ok) {
      return response.json().then(json => {
        logout({ history, clearSession });
        setSuccessMessages([json]);
      });
    } else {
      return response.json().then(json => {
        const messages = Array.isArray(json) ? json : [json];
        setErrorMessages(messages);
      });
    }
  });
}
