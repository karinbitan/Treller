import { authService } from "../../services/authService";

export function login(userCred) {
  return async dispatch => {
    const user = await authService.login(userCred);
    dispatch({ type: 'SET_USER', user });
    return user;
  }
}

export function signup(userCred) {
  return async dispatch => {
    const user = await authService.signup(userCred);
    dispatch({ type: 'SET_USER', user });
  }
}

export function logout() {
  return async dispatch => {
    await authService.logout();
    dispatch({ type: 'SET_USER', user: null });
  }
}

export function getLoggedInUser() {
  return async dispatch => {
    try {
      const user = await authService.getLoggedInUser();
      if (Object.entries(user).length === 0) return;
      dispatch({ type: 'SET_USER', user });
    } catch (err) {
      console.log('UserActions: err in logout', err);
    }
  };
}