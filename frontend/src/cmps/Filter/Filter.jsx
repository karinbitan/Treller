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
        debugger
        await this.props.loadCards(this.state.filterBy);
        console.log(this.props.cards)
    }

    render() {
        // const { cards } = this.props;
        const { isFormOpen } = this.state;
        return (
            <section className="filter">
                <form onSubmit={this.setFilter}>
                    <input type="search" className="search" name="title"
                        onChange={this.handleChange} onFocus={this.toggleForm} onBlur={this.toggleForm} />
                    <button className="search-btn"><i className="fa fa-search"></i></button>
                </form>
                {isFormOpen && <div className="search-tab pop-up" >
                    <p>Seatch Results</p>
                    <ul>
                        {/* {cards.map(card => {
                            if (card) {
                                return <li key={card._id}>{card}</li>
                            } else {
                                <li>No cards found...</li>
                            }
                        })} */}
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