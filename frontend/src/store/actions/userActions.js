import { userService } from "../../services/userSercvice";

export function getUsers(filter) {
  return async dispatch => {
    debugger
    const users = await userService.query(filter);
    dispatch({ type: 'SET_USERS', users });
  }
}

export function setUser(userId) {
    return async dispatch => {
      const user = await userService.getUserById(userId);
      dispatch({ type: 'SET_USER', user });
    }
  }

  export function updateUser(user) {
    return async dispatch => {
      const savedUser = await userService.updateUser(user);
      dispatch({ type: 'SET_USER', user: savedUser });
    }
  }