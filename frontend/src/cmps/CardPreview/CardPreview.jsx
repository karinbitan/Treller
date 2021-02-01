import { Component } from 'react';
import { connect } from 'react-redux';
import { deleteCard, updateCard, addCard } from '../../store/actions/cardActions';
import { eventBus } from '../../services/eventBusService';

import Avatar from 'react-avatar';
import { CardDetails } from '../../pages/CardDetails/CardDetails';
import { CardEditModal } from '../CardEditModal/CardEditModal';

import './CardPreview.scss';

export class _CardPreview extends Component {

    state = {
        isEditModalOpen: false,
        isDetailsModalOpen: false,
        showEditBtn: false,
        screenCard: {
            top: null,
            left: null
        }
    }

    onDeleteCard = async () => {
        const { board, listIdx, card } = this.props;
        await this.props.deleteCard(board._id, listIdx, card._id);
        this.setState({ isEditModalOpen: false })
        eventBus.emit('cardChanged');
    }

    onUpdateCard = async (cardToEdit) => {
        await this.props.updateCard(cardToEdit);
        this.setState({ isEditModalOpen: false });
        eventBus.emit('cardChanged');
        // eventBus.emit('notification', {
        //     title: 'Card updated',
        //     card: cardToEdit,
        //     by: this.props.user
        // })
    }

    onCopyCard = async () => {
        const { board, list, listIdx, card } = this.props;
        await this.props.addCard(board._id, list._id, listIdx, card);
        eventBus.emit('cardChanged');
        this.setState({ isEditModalOpen: false })
    }

    // EDIT //
    showEditBtn = () => {
        this.setState({ showEditBtn: true })
    }

    hideEditBtn = () => {
        this.setState({ showEditBtn: false })
    }

    openEditModal = (ev) => {
        ev.stopPropagation();
        let { screenCard } = this.state;
        screenCard.top = ev.screenY;
        screenCard.left = ev.screenX;
        this.setState({ isEditModalOpen: true, screenCard })
    }

    closeEditModal = () => {
        this.setState({ isEditModalOpen: false })
    }

    // DETAILS //
    openDetailsModal = () => {
        this.setState({ isDetailsModalOpen: true })
    }

    onCloseDetailsModal = () => {
        this.setState({ isDetailsModalOpen: false })
    }

    render() {
        const { card, list, listIdx } = this.props;
        const { isEditModalOpen, isDetailsModalOpen, showEditBtn, screenCard } = this.state;
        return (
            <section className="card-preview" onMouseEnter={this.showEditBtn}
                onMouseLeave={this.hideEditBtn}>
                {card.labels && <div className="flex">
                    {card.labels.map(label => {
                        return <div className={`label ${label.color}`} key={label.color}></div>
                    })}
                </div>}
                <p onClick={this.openDetailsModal} className="card-title">{card.title}</p>
                {card.members &&
                    <div className="members flex flex-end">
                        {card.members.map(member => {
                            return (
                                <Avatar name={member.fullName} round={true} size={25} key={member._id} />
                            )
                        })}
                    </div>}
                <button className="edit-icon-btn" onClick={this.openEditModal}
                    style={{ display: showEditBtn ? 'block' : 'none' }} ref={el => this.myBtnaRef = el} >
                    <i className="fas fa-pen edit-icon"></i>
                </button>
                {isEditModalOpen && <CardEditModal card={card} screenCard={screenCard}
                    onCloseEditModal={this.closeEditModal} onUpdateCard={this.onUpdateCard} onDeleteCard={this.onDeleteCard}
                    onCopyCard={this.onCopyCard} />}
                {isDetailsModalOpen && <CardDetails cardId={card._id} list={list}
                    listIdx={listIdx} onCloseDetailsModal={this.onCloseDetailsModal} />}
            </section>
        )
    }

}

const mapDispatchToProps = {
    deleteCard,
    updateCard,
    addCard

}
export const CardPreview = connect(null, mapDispatchToProps)(_CardPreview)