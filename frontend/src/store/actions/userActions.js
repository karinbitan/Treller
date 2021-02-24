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
        const user = await userService.addUserNotification(userId, notification);
        dispatch({ type: 'UPDATE_USER', user });
      } catch (err) {
        console.log(err);
      }
    }
  }

  export function addBoardToFavorite(userId, boardId) {
    return async dispatch => {
      try {
        const user = await userService.addBoardToFavorite(userId, boardId);
        dispatch({ type: 'UPDATE_USER', user });
      } catch (err) {
        console.log(err);
      }
    }
  }

  export function removeBoardFromFavorite(userId, boardId) {
    return async dispatch => {
      try {
        const user = await userService.removeBoardFromFavorite(userId, boardId);
        dispatch({ type: 'UPDATE_USER', user });
      } catch (err) {
        console.log(err);
      }
    }
  }