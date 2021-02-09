import { Component } from 'react';
import { connect } from 'react-redux';
import { getSearchResult } from './../../store/actions/searchActions';
import { getBoardById } from './../../store/actions/boardActions';
import { Link } from 'react-router-dom';
import { CardPreview } from './../CardPreview/CardPreview';

import './Filter.scss';
import { eventBus } from '../../services/eventBusService';

export class _Filter extends Component {

    state = {
        filterBy: {
            txt: ''
        },
        isFormOpen: false,
        searchResult: [],
        isSearch: false,
        listTitle: '',
        boardTitle: ''
    }

    toggleForm = () => {
        this.setState({ isFormOpen: !this.state.isFormOpen })
    }

    openForm = () => {
        this.setState({ isFormOpen: true })
    }

    closeForm = () => {
        this.setState({ isFormOpen: false })
    }


    handleChange = ({ target }) => {
        const field = target.name;
        const value = target.value;
        this.setState(prevState => ({ filterBy: { ...prevState.filterBy, [field]: value } }));
    }

    setFilter = async (ev) => {
        ev.preventDefault();
        let results = await this.props.getSearchResult(this.state.filterBy);
        this.setState({ searchResult: results })
        this.setState({ isSearch: true })
        results.forEach(async (result) => {
            let board = await this.props.getBoardById(result.createdBy.boardId);
            let list = board.lists.find(list =>{
               return list._id === result.createdBy.listId;
            })
            this.setState({ boardTitle: board.title })
            this.setState({ listTitle: list.title })
        })
    }

    // onSetBoard = async(boardId)=>{
    //     eventBus.emit('onSetBoard', boardId)
    // }
// How to set new board after click on card link //

    render() {
        const { isFormOpen, searchResult, isSearch, listTitle, boardTitle } = this.state;
        return (
            <section className="filter">
                <form onSubmit={this.setFilter}>
                    <input type="search" className="search-input" name="txt"
                        onChange={this.handleChange} onFocus={this.openForm} />
                    {!isFormOpen && <button type="button" className="search-btn"><i className="fa fa-search"></i></button>}
                </form>
                {isFormOpen && <div className="search-tab pop-up" >
                    <button onClick={this.closeForm} className="close-btn"><i className="fas fa-times"></i></button>
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
                                            <Link to={`/treller/card/${result._id}`}>
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