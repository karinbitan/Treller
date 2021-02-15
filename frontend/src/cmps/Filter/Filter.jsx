import { connect } from 'react-redux';
import { getSearchResult } from './../../store/actions/searchActions';
import { getBoardById } from './../../store/actions/boardActions';
import { Link, useLocation } from 'react-router-dom';
import { CardPreview } from './../CardPreview/CardPreview';
import { useState } from 'react';

import './Filter.scss';

export function _Filter(props) {
    const location = useLocation();
    const [filterBy, setFilterBy] = useState({ txt: '' });
    const [searchResult, setSearchResult] = useState([]);
    const [isSearch, toggleIsSearch] = useState(false)
    const [isFormOpen, toggleForm] = useState(false);
    const [listTitle, setListTitle] = useState('');
    const [boardTitle, setBoardTitle] = useState('');

    const setFilter = async (ev) => {
        ev.preventDefault();
        let results = await props.getSearchResult(filterBy);
        setSearchResult(results);
        toggleIsSearch(true);
        results.forEach(async (result) => {
            let board = await props.getBoardById(result.createdBy.boardId);
            let list = board.lists.find(list => {
                return list._id === result.createdBy.listId;
            })
            setBoardTitle(board.title);
            setListTitle(list.title);
        })
    }

    // onSetBoard = async(boardId)=>{
    //     eventBus.emit('onSetBoard', boardId)
    // }
    // How to set new board after click on card link //

    return (
        <section className="filter">
            <form onSubmit={(ev) => setFilter(ev)}>
                <input type="search" className="search-input" name="txt"
                    onChange={(ev) => setFilterBy({ ...filterBy, [ev.target.name]: ev.target.value })} onFocus={() => toggleForm(true)} />
                {!isFormOpen && <button type="button" className="search-btn"><i className="fa fa-search"></i></button>}
            </form>
            {isFormOpen && <div className="search-tab pop-up" >
                <button onClick={() => toggleForm(false)} className="close-btn"><i className="fas fa-times"></i></button>
                <p className="headline">Search Results</p>
                {isSearch &&
                    <div>
                        {(searchResult && searchResult.length > 0) ? <ul>
                            {searchResult.map(result => {
                                return (
                                    <li key={result._id} className="flex align-center">
                                        <div className="card-preview-search">
                                            <CardPreview card={result} isSearch={true} />
                                        </div>
                                        <Link to={{
                                            pathname: `/treller/card/${result._id}`,
                                            state: { background: location }
                                        }}>
                                            <h4 className="card-name">{result.title}</h4>
                                            <p className="list-board-name">
                                                In <span className="bold">{listTitle} </span>
                                                    On <span className="bold">{boardTitle}</span>
                                            </p>
                                        </Link>
                                    </li>
                                )
                            })}
                        </ul>
                            : <span>Can't find search result...</span>}
                    </div>}
            </div>}
        </section>
    )
}

function mapStateToProps(state) {
    return {
        searchResult: state.searchReducer.searchResult
    }
}
const mapDispatchToProps = {
    getSearchResult,
    getBoardById
}
export const Filter = connect(mapStateToProps, mapDispatchToProps)(_Filter)