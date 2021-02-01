
import { Component } from 'react'

import './CardEditModal.scss'

export class CardEditModal extends Component {

    state = {
        cardToEdit: null
    }

    componentDidMount = () => {
        const cardToEdit = this.props.card;
        this.setState({ cardToEdit })
        console.log(this.props)
    }

    handleChange = ({ target }) => {
        const field = target.name;
        const value = target.value;
        this.setState(prevState => ({ cardToEdit: { ...prevState.cardToEdit, [field]: value } }));
    }

    onCloseEditModal = () => {
        this.props.onCloseEditModal()
    }

    onDeleteCard = () => {
        this.props.onDeleteCard();
    }

    onCopyCard = () => {
        this.props.onCopyCard();
    }

    onUpdateCard = (ev) => {
        ev.preventDefault();
        this.props.onUpdateCard(this.state.cardToEdit)
    }

    render() {
        const { cardToEdit } = this.state;
        const { screenCard } = this.props;
        return (
            <section className="card-edit modal">
                <button className="close-btn" onClick={this.onCloseEditModal}><i className="fas fa-times"></i></button>
                <div className="card-edit modal-content"
                    style={{ top: screenCard.top - 99, left: screenCard.left - 214 }}>
                    {cardToEdit && <form onSubmit={this.onUpdateCard}>
                        <textarea name="title" value={cardToEdit.title} onChange={this.handleChange}></textarea>
                        <button className="add-form-btn">Save card</button>
                    </form>}
                    <div>
                        <p onClick={this.onCopyCard} className="modal-content txt">Copy card</p>
                        <p onClick={this.onDeleteCard} className="modal-content txt">Delete card</p>
                    </div>
                </div>
            </section>
        )
    }
}

