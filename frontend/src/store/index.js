import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { boardReducer } from './reducers/boardReducer';
import { userReducer } from './reducers/userReducer';
import { cardReducer } from './reducers/cardReducer';
import { searchReducer } from './reducers/searchReducer';


const rootReducer = combineReducers({
  boardReducer,
  userReducer,
  cardReducer,
  searchReducer
})
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
export const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)))