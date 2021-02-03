import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import Avatar from 'react-avatar';
import { CardEditModal } from '../CardEditModal/CardEditModal';

import './CardPreview.scss';

export function CardPreview(props) {
    const location = useLocation();
    const [isEditModalOpen, toggleEditModal] = useState(false);
    const [isEditBtnShow, toggleEditBtn] = useState(false);

    useEffect(() => {
        console.log('something');
    })
    // state = {
    //     isEditModalOpen: false,
    //     showEditBtn: false,
    //     screenCard: {
    //         top: null,
    //         left: null
    //     }
    // }

    const onDeleteCard = async () => {
        const { board, listIdx, card } = this.props;
        props.onDeleteCard(board._id, listIdx, card._id);
        toggleEditModal(false);
    }

    const onUpdateCard = async (cardToEdit) => {
        await this.props.updateCard(cardToEdit);
        toggleEditModal(false)
        // eventBus.emit('notification', {
        //     title: 'Card updated',
        //     card: cardToEdit,
        //     by: this.props.user
        // })
    }

    const onCopyCard = async () => {
        const { board, list, listIdx, card } = this.props;
        this.props.addCard(board._id, list._id, listIdx, card);
        toggleEditModal(false);
    }

    // EDIT //
    // const showEditBtn = () => {
    //     this.setState({ showEditBtn: true })
    // }

    // const hideEditBtn = () => {
    //     this.setState({ showEditBtn: false })
    // }

    // const openEditModal = (ev) => {
    //     ev.stopPropagation();
    //     let { screenCard } = this.state;
    //     screenCard.top = ev.screenY;
    //     screenCard.left = ev.screenX;
    //     this.setState({ isEditModalOpen: true, screenCard })
    // }

    // const closeEditModal = () => {
    //     this.setState({ isEditModalOpen: false })
    // }

    // DETAILS //
    // const openDetailsModal = () => {
    //     this.setState({ isDetailsModalOpen: true })
    // }

    // const onCloseDetailsModal = () => {
    //     this.setState({ isDetailsModalOpen: false })
    // }

    const { card, list, listIdx } = props;
    return (
        <section>
            {card.style.cover && <div className="cover-container">
                <div className={card.style.cover.color ? 'color ' + card.style.cover.color :
                    'picture ' + card.style.cover.picture}></div>
            </div>}
            <section className="card-preview"
                onMouseEnter={() => toggleEditBtn(true)}
                onMouseLeave={() => toggleEditBtn(false)}
            >
                {card.labels && <div className="flex">
                    {card.labels.map(label => {
                        return <div className={`label ${label.color}`} key={label.color}></div>
                    })}
                </div>}
                {/* <p onClick={this.openDetailsModal} className="card-title">{card.title}</p> */}
                <Link to={{
                    pathname: `/treller/card/${card._id}`,
                    state: { background: location }
                }}>{card.title}</Link>
                {card.members &&
                    <div className="members flex flex-end">
                        {card.members.map(member => {
                            return (
                                <Avatar name={member.fullName} round={true} size={25} key={member._id} />
                            )
                        })}
                    </div>}
                <button className="edit-icon-btn"
                    onClick={() => toggleEditModal(true)}
                    style={{ display: isEditBtnShow ? 'block' : 'none' }}
                //  ref={el => this.myBtnaRef = el} 
                >
                    <i className="fas fa-pen edit-icon"></i>
                </button>
                {isEditModalOpen && <CardEditModal card={card}
                    onCloseEditModal={() => toggleEditModal(false)} onUpdateCard={onUpdateCard}
                    onDeleteCard={onDeleteCard}
                    onCopyCard={onCopyCard} />}
                {/* {isDetailsModalOpen && <CardDetails cardId={card._id} list={list}
                    listIdx={listIdx} onCloseDetailsModal={this.onCloseDetailsModal} />} */}
            </section>
        </section>
    )
}

// TO ADD SCREEN CARD // 