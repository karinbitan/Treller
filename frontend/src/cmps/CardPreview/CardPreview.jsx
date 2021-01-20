import { Component } from 'react';
import { CardDetails } from '../../pages/CardDetails/CardDetails';
import { eventBus } from '../../services/eventBusService';


import './CardPreview.scss';

export class CardPreview extends Component {

    state = {
        isEditModalOpen: false,
        isDetailsModalOpen: false,
        cardToEdit: null
    }

    componentDidMount = () => {
        eventBus.on('close-details-modal', () => {
            this.setState({ isDetailsModalOpen: false })
        });
        const cardToEdit = this.props.card;
        this.setState({ cardToEdit })
    }

    handleChange = ({ target }) => {
        const field = target.name;
        const value = target.value;
        this.setState(prevState => ({ cardToEdit: { ...prevState.cardToEdit, [field]: value } }));
    }

    openEditModal = (ev) => {
        ev.stopPropagation();
        this.setState({ isEditModalOpen: true })
    }

    closeEditModal = (ev) => {
        ev.stopPropagation();
        this.setState({ isEditModalOpen: false })
    }

    openDetailsModal = (ev) => {
        ev.stopPropagation();
        this.setState({ isDetailsModalOpen: true })
    }

    onDeleteCard = () => {
        this.props.onDeleteCard(this.props.card._id);
        this.setState({ isEditModalOpen: false })
    }

    onUpdateCard = (ev) => {
        ev.preventDefault();
        this.props.onUpdateCard(this.state.cardToEdit);
        this.setState({ isEditModalOpen: false })
    }

    render() {
        const { card } = this.props;
        const { cardToEdit, isEditModalOpen, isDetailsModalOpen } = this.state;
        return (
            <section className="card-preview">
                {card.labels && <div className="flex">
                    {card.labels.map(label => {
                        return <div className={`label ${label.color}`} key={label.color}></div>
                    })}
                </div>}
                {card && <p onClick={this.openDetailsModal} className="card-title">{card.title}</p>}
                {isDetailsModalOpen && <CardDetails cardId={card._id} />}
                <button className="edit-icon-btn" onClick={this.openEditModal}><i className="fas fa-pen edit-icon"></i></button>
                {isEditModalOpen && <section className="card-option modal">
                    <div className="card-option modal-content">
                        {cardToEdit && <form onSubmit={this.onUpdateCard}>
                            <textarea name="title" value={cardToEdit.title} onChange={this.handleChange}></textarea>
                            <button className="add-form-btn">Save card</button>
                        </form>}
                        <div>
                            <p className="modal-content txt">Move card</p>
                            <p className="modal-content txt">Copy card</p>
                            <p onClick={this.onDeleteCard} className="modal-content txt">Delete card</p>
                        </div>
                        <button className="modal-close-btn" onClick={this.closeEditModal}><i className="fas fa-times"></i></button>
                    </div>
                </section>}
            </section>
        )
    }

}

// onMouseOver={this.showIcon}