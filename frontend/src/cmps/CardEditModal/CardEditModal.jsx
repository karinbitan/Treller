import { useEffect, useState } from 'react';

import './CardEditModal.scss';

export function CardEditModal(props) {
    const [cardTitle, changeCardTitle] = useState(props.cardTitle);

    useEffect(() => {
        console.log(props)
    })

    const onUpdateCardTitle = (ev) => {
        ev.preventDefault();
        props.onUpdateCardTitle(cardTitle)
    }

    return (
        <section className="card-edit modal">
            <button className="close-btn" onClick={() => props.onCloseEditModal}><i className="fas fa-times"></i></button>
            <div className="card-edit modal-content"
                style={{ top: props.screenCard.top - 99, left: props.screenCard.left - 214 }}
            >
                <form onSubmit={(ev) => onUpdateCardTitle(ev)}>
                    <textarea name="title" value={cardTitle} onChange={(ev) => changeCardTitle(ev.target.value)}
                        className="card-title-textarea"></textarea>
                    <button className="add-form-btn">Save card</button>
                </form>
                <div className="card-edit-options">
                    <p onClick={() => props.onCopyCard}>Copy card</p>
                    <p onClick={() => props.onDeleteCard}>Delete card</p>
                </div>
            </div>
        </section>
    )
}

