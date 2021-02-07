import { searchService } from './../../services/searchService';

export function getSearchResult(filterBy) {
  return async dispatch => {
    try {
      const result = await searchService.getSearchResult(filterBy);
      dispatch({ type: 'SET_RESULT', result });
      return result;
    } catch (err) {
      console.log(err);
    }
  }
}