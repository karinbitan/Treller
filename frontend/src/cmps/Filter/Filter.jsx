import { Component } from 'react';
import { connect } from 'react-redux';
import { getSearchResult } from './../../store/actions/searchActions';

import './Filter.scss';

export class _Filter extends Component {

    state = {
        filterBy: {
            txt: ''
        },
        isFormOpen: false,
        searchResult: []
    }

    async componentDidMount() {
        // await this.props.loadCards();
        // console.log(this.props.cards)
    }

    toggleForm = () => {
        this.setState({ isFormOpen: !this.state.isFormOpen })
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
    }

    render() {
        const { isFormOpen, searchResult } = this.state;
        // const { searchResult } = this.props;
        return (
            <section className="filter">
                <form onSubmit={this.setFilter}>
                    <input type="search" className="search" name="txt"
                        onChange={this.handleChange} onFocus={this.toggleForm} onBlur={this.toggleForm} />
                    <button className="search-btn"><i className="fa fa-search"></i></button>
                </form>
                {isFormOpen && <div className="search-tab pop-up" >
                    <p>Search Results</p>
                    {(searchResult && searchResult.length > 0) ? <ul>
                        {searchResult.map(result => {
                            return <li key={result._id}>{result.title}</li>
                        })}
                    </ul>
                        : <p>Can't found result...</p>
                    }
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