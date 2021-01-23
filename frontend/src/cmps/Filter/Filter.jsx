import { Component } from 'react';
import { connect } from 'react-redux';
import { loadCards } from '../../store/actions/cardActions';

import './Filter.scss';

export class _Filter extends Component {

    state = {
        filterBy: {
            title: ''
        },
        isFormOpen: false
    }

    toggleForm = () => {
        this.setState({isFormOpen: !this.state.isFormOpen})
    }

    handleChange = ({ target }) => {
        const field = target.name;
        const value = target.value;
        this.setState(prevState => ({ filterBy: { ...prevState.filterBy, [field]: value } }));
    }

    setFilter = async (ev) => {
        ev.preventDefault();
        await this.props.loadCards(this.state.filterBy);
    }

    render() {
        const { cards } = this.props;
        const { isFormOpen } = this.state;
        return (
            <section className="filter">
                <form onSubmit={this.setFilter}>
                    <input type="search" className="search" name="" onFocus={this.toggleForm} onBlur={this.toggleForm} />
                    <button className="no-button"><i className="fa fa-search search-icon"></i></button>
                </form>
                {isFormOpen && <div className="search-tab pop-up" >
                    <p>Seatch Results</p>
                    <ul>
                        {cards.map(card => {
                            if (card) {
                                return <li key={card._id}>{card}</li>
                            } else {
                                <li>No cards found...</li>
                            }
                        })}
                    </ul>
                </div>}
            </section>
        )
    }
}

function mapStateToProps(state) {
    return {
        cards: state.cardReducer.cards
    }
}
const mapDispatchToProps = {
    loadCards,

}
export const Filter = connect(mapStateToProps, mapDispatchToProps)(_Filter)