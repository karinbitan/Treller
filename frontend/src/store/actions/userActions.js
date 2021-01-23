import { userService } from "../../services/userSercvice";

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