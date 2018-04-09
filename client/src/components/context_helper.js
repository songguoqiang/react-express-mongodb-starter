import { object, shape, func, string } from "prop-types";

export function mapMessageContextToProps(context) {
  return {
    messageContext: {
      messages: context.messages,
      clearMessages: context.actions.clearMessages,
      setSuccessMessages: context.actions.setSuccessMessages,
      setErrorMessages: context.actions.setErrorMessages
    }
  };
}

export function mapSessionContextToProps(context) {
  return {
    sessionContext: {
      token: context.jwtToken,
      user: context.user,
      saveSession: context.actions.saveSession,
      clearSession: context.actions.clearSession
    }
  };
}

export const messageContextPropType = {
  messageContext: shape({
    messages: object.isRequired,
    clearMessages: func.isRequired,
    setSuccessMessages: func.isRequired,
    setErrorMessages: func.isRequired
  }).isRequired
};

export const sessionContextPropType = {
  sessionContext: shape({
    token: string,
    user: object,
    saveSession: func.isRequired,
    clearSession: func.isRequired
  }).isRequired
};

export const authenticatedSessionContextPropType = {
  sessionContext: shape({
    token: string.isRequired,
    user: shape({
      picture: string,
      gravatar: string,
      name: string,
      email: string.isRequired,
      id: string
    }),
    saveSession: func.isRequired,
    clearSession: func.isRequired
  }).isRequired
};
