import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { utilService } from '../../services/utilService';

import Avatar from 'react-avatar';
import { CardEditModal } from '../CardEditModal/CardEditModal';

import './CardPreview.scss';

export function CardPreview(props) {
    const location = useLocation();
    const [isEditModalOpen, toggleEditModal] = useState(false);
    const [isEditBtnShow, toggleEditBtn] = useState(false);
    const [screenCard, setScreenCard] = useState({ top: null, left: null })

    // useEffect(() => {
    //     console.log('something');
    // })

    const onDeleteCard = async () => {
        const { board, listIdx, card } = this.props;
        props.onDeleteCard(board._id, listIdx, card._id);
        toggleEditModal(false);
    }

    const onUpdateCard = async (cardToEdit) => {
        await props.onUpdateCard(cardToEdit);
        toggleEditModal(false)
    }

    const onCopyCard = async () => {
        const { board, list, listIdx, card } = this.props;
        this.props.addCard(board._id, list._id, listIdx, card);
        toggleEditModal(false);
    }

    const openEditModal = (ev) => {
        setScreenCard({ top: ev.screenY, left: ev.screenX });
        toggleEditModal(true)
    }

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
                    onClick={(ev) => openEditModal(ev)}
                    style={{ display: isEditBtnShow ? 'block' : 'none' }}
                //  ref={el => this.myBtnaRef = el} 
                >
                    <i className="fas fa-pen edit-icon"></i>
                </button>
                <div className="info-btn-container flex flex-start">
                    {card.description && <button className="info-btn" title="This card has description"><i className="fas fa-align-left"></i></button>}
                    {(card.comments && card.comments.length > 0) && <button className="info-btn" title="This card has comments"><i className="far fa-comment"></i></button>}
                    {(card.checklists && card.checklists.length > 0) && <button className="info-btn" title="This card has checklist"><i className="fas fa-tasks"></i></button>}
                    {card.dueDate && <button className="info-btn due-date">
                        <i className="far fa-clock"></i>
                        {` ${utilService.convertToMonthString(card.dueDate)}  ${new Date(card.dueDate).getDate()}`}
                        {card.isCardComplete && <span className="due-status complete">Complete</span>}
                        {new Date() > new Date(card.dueDate) &&
                            <span className="due-status over-due">Over Due</span>}
                    </button>}
                </div>
                {isEditModalOpen && <CardEditModal card={card}
                    onCloseEditModal={() => toggleEditModal(false)} onUpdateCard={onUpdateCard}
                    onDeleteCard={onDeleteCard}
                    onCopyCard={onCopyCard}
                    screenCard={screenCard} />}
            </section>
        </section>
    )
}
