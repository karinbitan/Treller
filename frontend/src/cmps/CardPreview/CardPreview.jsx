import { useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { utilService } from '../../services/utilService';
// import { socketService } from '../../services/socketService';

import Avatar from 'react-avatar';
import { CardEditModal } from '../CardEditModal/CardEditModal';

import './CardPreview.scss';

export function CardPreview(props) {
    const location = useLocation();
    const [isEditModalOpen, toggleEditModal] = useState(false);
    const [isEditBtnShow, toggleEditBtn] = useState(false);
    const [screenCard, setScreenCard] = useState({ top: null, left: null })
    let history = useHistory();
    const { card, isSearch } = props;

    useEffect(() => {
    })

    const cardDetail = (ev) => {
        ev.stopPropagation();
        if (isEditModalOpen) return;
        const x = {
            pathname: `/treller/card/${card._id}`,
            state: { background: location }
        }
        history.push(x)
    }

    const deleteCard = async () => {
        const { card } = props;
        props.deleteCard(card._id);
        toggleEditModal(false);
    }

    const updateCardTitle = (cardTitle) => {
        props.updateCardTitle(props.card._id, cardTitle);
        toggleEditModal(false);
    }

    const copyCard = async () => {
        const { card } = props;
        props.copyCard(card);
        toggleEditModal(false);
    }

    const openEditModal = (ev) => {
        ev.stopPropagation();
        setScreenCard({ top: ev.screenY, left: ev.screenX });
        toggleEditModal(true)
    }

    return (
        <section>
            {card.style.cover && <div className="cover-container">
                <div className={card.style.cover.color ? 'color ' + card.style.cover.color :
                    'picture ' + card.style.cover.picture}></div>
            </div>}
            <section className="card-preview"
                onMouseEnter={() => toggleEditBtn(true)}
                onMouseLeave={() => toggleEditBtn(false)}
                onClick={cardDetail}
            >
                {card.labels && <div className="flex">
                    {card.labels.map((label, idx) => {
                        return <div className={`label ${label}`} key={idx}></div>
                    })}
                </div>}
                {card.title}
                {!isSearch && <button className="edit-icon-btn"
                    onClick={(ev) => openEditModal(ev)}
                    style={{ display: isEditBtnShow ? 'block' : 'none' }}>
                    <i className="fas fa-pen edit-icon"></i>
                </button>}
                <div className="info-btn-container flex space-between">
                    <div>
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
                    {card.members &&
                        <div className="members flex flex-end">
                            {card.members.map(member => {
                                return (
                                    <Avatar name={member.fullName} round={true} size={25} key={member._id} />
                                )
                            })}
                        </div>}
                </div>
                {isEditModalOpen && <CardEditModal
                    cardTitle={card.title}
                    onCloseEditModal={() => toggleEditModal(false)}
                    updateCardTitle={updateCardTitle}
                    onDeleteCard={deleteCard}
                    onCopyCard={copyCard}
                    screenCard={screenCard} />}
            </section>
        </section>
    )
}
