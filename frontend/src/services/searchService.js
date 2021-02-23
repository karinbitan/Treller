import { httpService } from './httpService';

export const searchService = {
    getCardSearchResult,
    getUserSearchResult
}

function getCardSearchResult(filter = null) {
    var filterStr = '';
    if (filter) {
        const searchStr = (filter.txt) ? `&txt=${filter.txt}` : '';
        filterStr = searchStr;
    }
    return httpService.get(`search/card?=${filterStr}`);
}

function getUserSearchResult(filter = null) {
    var filterStr = '';
    if (filter) {
        const searchStr = (filter.txt) ? `&txt=${filter.txt}` : '';
        filterStr = searchStr;
    }
    return httpService.get(`search/user?=${filterStr}`);
}

