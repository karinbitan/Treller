import { useEffect, useRef, useState } from 'react';

import './CardEditModal.scss';

export function CardEditModal(props) {
    const [cardTitle, changeCardTitle] = useState(props.cardTitle);
    const [isMoveCardOpen, toggleOpenMoveCardPopUp] = useState(false);
    const [newCardPosition, setNewCardPosition] = useState(props.cardIdx);
    const [newListPosition, setNewListPosition] = useState(props.listIdx);
    const node = useRef();

    useEffect(() => {
        // add when mounted
        document.addEventListener("mousedown", handleClick);
        // return function to be called when unmounted
        return () => {
            document.removeEventListener("mousedown", handleClick);
        };
    }, []);

    const handleClick = e => {
        if (node.current) {
            if (node.current.contains(e.target)) {
                return;
            }
        }
        props.onCloseEditModal();
    };

    const onUpdateCardTitle = (ev) => {
        ev.preventDefault();
        props.updateCardTitle(cardTitle)
    }

    const onMoveCard = (ev) => {
        ev.preventDefault();
        props.moveCard(newListPosition, newCardPosition);
        toggleOpenMoveCardPopUp(false);
        setNewCardPosition(null);
    }

    return (
        <section className="card-edit modal">
            <button className="close-btn-modal" onClick={props.onCloseEditModal}><i className="fas fa-times"></i></button>
            <div ref={node} className="card-edit modal-content"
                style={{ top: props.screenCard.top - 99, left: props.screenCard.left - 214 }}
            >
                <form onSubmit={(ev) => onUpdateCardTitle(ev)}>
                    <textarea name="title" value={cardTitle} onChange={(ev) => changeCardTitle(ev.target.value)}
                        className="card-title-textarea"></textarea>
                    <button className="add-form-btn">Save card</button>
                </form>
                <div className="card-edit-options">
                    <p className="card-option" onClick={props.onCopyCard}>Copy card</p>
                    <p className="card-option" onClick={props.onDeleteCard}>Delete card</p>
                    <p className="card-option" onClick={() => toggleOpenMoveCardPopUp(true)}>Move card</p>
                    {isMoveCardOpen && <div className="move-card pop-up">
                        <button className="close-btn" onClick={() => toggleOpenMoveCardPopUp(false)}><i className="fas fa-times"></i></button>
                        <p className="headline">Move Card</p>
                        <form onSubmit={(ev) => onMoveCard(ev)}>
                            <label className="select-card">Select List:</label>
                            <br />
                            <select className="select-move-card" defaultValue={props.listIdx}
                                onChange={(ev) => setNewListPosition(+ev.target.value)}>
                                {props.board.lists.map((list, idx) => {
                                    return (
                                        <option key={list._id}
                                            value={idx}>
                                            {list.title}{idx === props.listIdx ? ' (Current)' : ''}
                                        </option>
                                    )
                                })}
                            </select>
                            <br />
                            <label className="select-card">Select Position:
                            </label>
                            <br />
                            {(props.board.lists[newListPosition].cards.length > 0) ?
                                <select className="select-move-card" defaultValue={props.cardIdx}
                                    onChange={(ev) => setNewCardPosition(+ev.target.value)}>
                                    {props.board.lists[newListPosition].cards.map((card, idx) => {
                                        return (
                                            <option key={card._id} value={idx}>{idx + 1}{((idx === props.cardIdx) && (props.listIdx === newListPosition)) ? ' (Current)' : ''}</option>
                                        )
                                    })}
                                </select>
                                : <select className="select-move-card">
                                    <option value={0}>1</option>
                                </select>}
                            <br />
                            <button className="add-form-btn">Move</button>
                        </form>
                    </div>}
                </div>
            </div>
        </section>
    )
}

