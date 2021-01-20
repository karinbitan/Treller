import { Component } from 'react';
import { cardService } from '../../services/cardService';
import { connect } from 'react-redux';
import { setBoard } from '../../store/actions/boardActions';
import { addCard } from '../../store/actions/cardActions';

import './AddCard.scss'

export class _AddCard extends Component {

    state = {
        showing: false,
        cardToEdit: null
    }

    handleChange = ({ target }) => {
        const field = target.name;
        const value = target.value;
        this.setState(prevState => ({ cardToEdit: { ...prevState.cardToEdit, [field]: value } }));
    }

    componentDidMount() {
        const cardToEdit = cardService.getEmptyCard();
        this.setState({ cardToEdit });
    }

    toggleForm = (ev) => {
        ev.stopPropagation();
        this.setState({ showing: !this.state.showing })
    }

    addCard = async (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        const { listIdx, boardId } = this.props;
        const { cardToEdit } = this.state;
        await this.props.addCard(boardId, listIdx, cardToEdit);
        await this.props.setBoard(boardId);
        this.setState(({ cardToEdit: { ...this.state.cardToEdit, title: '' } }));
        this.setState({ showing: false })
    }

    render() {
        const { showing, cardToEdit } = this.state;
        return (
            <section className="add-card-container">
                {!showing ? <div onClick={this.toggleForm} className="add-card"><i className="fas fa-plus"></i> Add a card</div>
                    : <form onSubmit={this.addCard} className="add-card-form">
                        <input type="text" className="add-form" name="title"
                            value={cardToEdit.title} onChange={this.handleChange}
                            placeholder="Enter a title for this card" />
                        <br />
                        <div className="flex">
                            <button className="add-form-btn">Add card</button>
                            <button className="exit-btn" onClick={this.toggleForm}><i className="fas fa-times"></i></button>
                        </div>
                    </form>}
            </section>
        )
    }
}

const mapDispatchToProps = {
    addCard,
    setBoard
}
export const AddCard = connect(null, mapDispatchToProps)(_AddCard)
