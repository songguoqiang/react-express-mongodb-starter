export function withCallbacksForMessages(props) {
  return {
    clearMessages: props.clearMessages,
    setSuccessMessages: props.setSuccessMessages,
    setErrorMessages: props.setErrorMessages
  };
}

export function withCallbacksForSession(props) {
  return {
    saveSession: props.saveSession,
    clearSession: props.clearSession
  };
}

export function mapMessageContextToProps(context) {
  return {
    messages: context.messages,
    clearMessages: context.actions.clearMessages,
    setSuccessMessages: context.actions.setSuccessMessages,
    setErrorMessages: context.actions.setErrorMessages
  };
}

export function mapSessionContextToProps(context) {
  return {
    token: context.jwtToken,
    user: context.user,
    saveSession: context.actions.saveSession,
    clearSession: context.actions.clearSession
  };
}
