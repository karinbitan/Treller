import { Component } from 'react';
import { connect } from 'react-redux';
import { getSearchResult } from './../../store/actions/searchActions';
import { Link } from 'react-router-dom';
import { CardPreview } from './../CardPreview/CardPreview';

import './Filter.scss';

export class _Filter extends Component {

    state = {
        filterBy: {
            txt: ''
        },
        isFormOpen: false,
        searchResult: [],
        isSearch: false
    }

    async componentDidMount() {
        // await this.props.loadCards();
        // console.log(this.props.cards)
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
        const res = await this.props.getSearchResult(this.state.filterBy);
        this.setState({ searchResult: res })
        this.setState({ isSearch: true })
        console.log(this.state.isSearch)
    }

    render() {
        const { isFormOpen, searchResult, isSearch } = this.state;
        // const { searchResult } = this.props;
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
                                        <li key={result._id}>
                                            <div>
                                                {/* <CardPreview card={result._id} /> */}
                                                <Link to={`/treller/card/${result._id}`}>
                                                    <h4>{result.title}</h4>
                                                    <p>In List on Board</p>
                                                </Link>
                                            </div>
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
    getSearchResult
}
export const Filter = connect(mapStateToProps, mapDispatchToProps)(_Filter)