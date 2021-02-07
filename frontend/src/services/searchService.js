import { httpService } from './httpService';

export const searchService = {
    getSearchResult
}

function getSearchResult(filter = null) {
    var filterStr = '';
    if (filter) {
        const searchStr = (filter.txt) ? `&txt=${filter.txt}` : '';
        filterStr = searchStr;
    }
    return httpService.get(`search?=${filterStr}`);
}
