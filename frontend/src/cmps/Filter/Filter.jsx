import { connect } from 'react-redux';
import { getCardSearchResult } from './../../store/actions/searchActions';
import { getBoardById } from './../../store/actions/boardActions';
import { Link, useLocation } from 'react-router-dom';
import { CardPreview } from './../CardPreview/CardPreview';
import { useEffect, useRef, useState } from 'react';

import './Filter.scss';

export function _Filter(props) {
    const location = useLocation();
    const [filterBy, setFilterBy] = useState({ txt: '' });
    const [searchResult, setSearchResult] = useState([]);
    const [isSearch, toggleIsSearch] = useState(false)
    const [isFormOpen, toggleForm] = useState(false);
    const [listTitle, setListTitle] = useState('');
    const [boardTitle, setBoardTitle] = useState('');
    const [isSearchMobileShow, toggleSearchMobile] = useState(false)
    const node = useRef();
    const searchTab = useRef();

    useEffect(() => {
        // add when mounted
        document.addEventListener("mousedown", handleClick);
        // return function to be called when unmounted
        return () => {
            document.removeEventListener("mousedown", handleClick);
        };
    }, []);

    const handleClick = e => {
        if (node.current.contains(e.target)) {
            return;
        }
        toggleForm(false)
    };

    const setFilter = async (ev) => {
        ev.preventDefault();
        if (!filterBy.txt || filterBy.txt.length < 0) return;
        let results = await props.getCardSearchResult(filterBy);
        setSearchResult(results);
        toggleIsSearch(true);
        if (results) {
            results.forEach(async (result) => {
                let board = await props.getBoardById(result.createdBy.boardId);
                let list = board.lists.find(list => {
                    return list._id === result.createdBy.listId;
                })
                setBoardTitle(board.title);
                setListTitle(list.title);
            })
        }
    }

    const closeForm = () => {
        toggleForm(false);
        setFilterBy({ txt: '' })
    }

    const isBoardMember = (boardId) => {
        const isMember = props.user.boardsMember.some(board => {
            return board === boardId;
        })
        return isMember;
    }

    const openMobileMenu = () => {
        toggleSearchMobile(true);
    }

    return (
        <section ref={node} className="filter">
            <form onSubmit={setFilter}>
                <input type="search" className="search-input" name="txt" value={filterBy.txt}
                    onChange={(ev) => setFilterBy({ ...filterBy, [ev.target.name]: ev.target.value })}
                    onFocus={() => toggleForm(true)} onBlur={closeForm} />
                {!isFormOpen && <button type="button" className="search-btn"><i className="fa fa-search"></i></button>}
                <button type="button" onClick={openMobileMenu} className="search-btn mobile"><i className="fa fa-search"></i></button>
            </form>
            {isFormOpen && <div ref={searchTab} className="search-tab pop-up" >
                <button onClick={closeForm} className="close-btn"><i className="fas fa-times"></i></button>
                <p className="headline">Search Results</p>
                {isSearch &&
                    <div className="flex justify-center">
                        {(searchResult && searchResult.length > 0) ? <ul>
                            {searchResult.map(result => {
                                if (!isBoardMember(result.createdBy.boardId)) return;
                                return (
                                    <li key={result._id} className="flex align-center">
                                        <div className="card-preview-search">
                                            <CardPreview card={result} isSearch={true} />
                                            <h1>Result {result.title}</h1>
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
                            : <span className="no-result-msg">We couldn't find any cards or boards that matched your search.</span>}
                    </div>}
            </div>}
            {isSearchMobileShow && <div className="filter-mobile modal">
                <button className="close-btn-modal" onClick={() => toggleSearchMobile(false)}><i className="fas fa-times"></i></button>
                <div className="filter-mobile modal-content">
                    <p className="headline">Search</p>
                    <form onSubmit={setFilter}>
                        <input type="search" className="search-input mobile" name="txt" value={filterBy.txt}
                            onChange={(ev) => setFilterBy({ ...filterBy, [ev.target.name]: ev.target.value })} />
                        <button type="button" className="search-btn"><i className="fa fa-search"></i></button>
                    </form>
                    <div className="search-tab-mobile">
                        {isSearch &&
                            <div className="flex justify-center">
                                {(searchResult && searchResult.length > 0) ? <ul>
                                    {searchResult.map(result => {
                                        if (!isBoardMember(result.createdBy.boardId)) return;
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
                                    : <span className="no-result-msg">We couldn't find any cards or boards that matched your search.</span>}
                            </div>}
                    </div>
                </div>
            </div>}
        </section>
    )
}

const mapDispatchToProps = {
    getCardSearchResult,
    getBoardById
}
export const Filter = connect(null, mapDispatchToProps)(_Filter)