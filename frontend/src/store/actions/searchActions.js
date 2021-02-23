import { searchService } from './../../services/searchService';

export function getCardSearchResult(filterBy) {
  return async dispatch => {
    try {
      const result = await searchService.getCardSearchResult(filterBy);
      return result;
    } catch (err) {
      console.log(err);
    }
  }
}

export function getUserSearchResult(filterBy) {
  return async dispatch => {
    try {
      const result = await searchService.getUserSearchResult(filterBy);
      return result;
    } catch (err) {
      console.log(err);
    }
  }
}