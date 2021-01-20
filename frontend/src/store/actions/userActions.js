import { userService } from "../../services/userSercvice";

export function setUser(userId) {
    return async dispatch => {
      const user = await userService.getUserById(userId);
      dispatch({ type: 'SET_USER', user });
    }
  }