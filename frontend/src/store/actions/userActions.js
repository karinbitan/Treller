import { userService } from "../../services/userSercvice";

export function getUsers(filter) {
  return async dispatch => {
    const users = await userService.query(filter);
    dispatch({ type: 'SET_USERS', users });
    return users;
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

  export function updateUserCollection(userId, updatedObject) {
    return async dispatch => {
      try {
        const savedUser = await userService.updateUserCollection(userId, updatedObject);
        dispatch({ type: 'UPDATE_USER', user: savedUser })
        dispatch({ type: 'SET_USER', user: savedUser })
      } catch (err) {
        console.log('ERROR!', err);
      }
    }
  }

  export function addUserNotification(userId, notification) {
    return async dispatch => {
      try {
        await userService.addUserNotification(userId, notification);
        // dispatch({ type: 'ADD_NOTIFICIATIONS', notification });
      } catch (err) {
        console.log(err);
      }
    }
  }