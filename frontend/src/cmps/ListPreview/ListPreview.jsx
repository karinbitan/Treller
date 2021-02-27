import { useEffect, useRef, useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { AddCard } from '../AddCard/AddCard';
import { CardPreview } from '../CardPreview';

import './ListPreview.scss';

const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    // change background colour if dragging
    background: isDragging ? '' : '#ebecf0',
    // styles we need to apply on draggables
    ...draggableStyle,
});

export function ListPreview(props) {
    const { list, listIdx, board } = props;

    const [listToEdit, updateListToEdit] = useState(list);
    const [newListPosition, setNewListPosition] = useState(null);
    const [isListActionOpen, toggleListAction] = useState(false);
    const [isMoveListOpen, toggleMoveList] = useState(false);
    const listTitleRef = useRef(null);
    const node = useRef();

    const prevList = usePrevious(list);
    useEffect(() => {
        if (prevList) {
            if (prevList !== list) {
                updateListToEdit(list);
            }
        }
    }, [list])

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
        toggleListAction(false)
    };

    const onEnterPress = (ev) => {
        if (ev.keyCode === 13 && ev.shiftKey === false) {
            ev.preventDefault();
            updateListTitle(ev);
        }
    }

    const updateListTitle = (ev) => {
        ev.preventDefault();
        props.updateListTitle(listIdx, listToEdit.title);
        listTitleRef.current.blur();
    }

    const onDeleteList = () => {
        props.deleteList(list._id);
        toggleListAction(false);
    }

    const openMoveListPopUp = () => {
        toggleMoveList(true);
    }

    const onMoveList = (ev) => {
        ev.preventDefault();
        props.moveList(listIdx, newListPosition);
        toggleMoveList(false);
        toggleListAction(false)
        setNewListPosition(null)
    }

    // CARD //
    const addCard = (card) => {
        props.addCard(list._id, listIdx, card)
    }

    const deleteCard = (cardId) => {
        props.deleteCard(listIdx, cardId);
    }

    const updateCardTitle = (cardId, cardTitle) => {
        props.updateCardTitle(cardId, cardTitle);
    }

    const moveCard = (newListPosition, cardIdx, newCardPosition) => {
        props.moveCard(list, listIdx, newListPosition, cardIdx, newCardPosition);
    }

    return (
        <section className="list-preview">
            {(list && listToEdit) && <div>
                {!board.isTemplate ? <form className="list-title-form">
                    <textarea ref={listTitleRef} className="list-title-textarea" name="title" value={listToEdit.title}
                        onChange={(ev) => updateListToEdit({ ...listToEdit, [ev.target.name]: ev.target.value })} onKeyDown={onEnterPress}
                        onBlur={updateListTitle}>
                    </textarea>
                </form>
                    : <div className="list-title-textarea">{listToEdit.title}</div>}
            </div>}
            <div ref={node}>
                <button onClick={() => toggleListAction(!isListActionOpen)} className="list-menu-icon"><i className="fas fa-ellipsis-h"></i></button>
                {isListActionOpen && <div className="list-actions">
                    <button className="close-btn" onClick={() => toggleListAction(false)}><i className="fas fa-times"></i></button>
                    {!isMoveListOpen ? <div className="list-main-menu">
                        <p>List Actions</p>
                        <ul>
                            <li onClick={onDeleteList}>Delete List</li>
                            <li onClick={openMoveListPopUp}>Move List</li>
                        </ul>
                    </div>
                        : <div className="move-list">
                            <button className="go-back no-button" onClick={() => toggleMoveList(false)}><i className="fas fa-arrow-left"></i></button>
                            <p>Move List</p>
                            <form onSubmit={(ev) => onMoveList(ev)}>
                                <label className="select-list">Select List:
                            </label>
                                <br />
                                <select className="select-move-list" onChange={(ev) => setNewListPosition(ev.target.value)}
                                    defaultValue={listIdx}>
                                    {board.lists.map((list, idx) => {
                                        return (
                                            <option key={list._id} value={idx}>{list.title} {idx === listIdx ? ' (Current)' : ''}</option>
                                        )
                                    })}
                                </select>
                                <br />
                                <button className="add-form-btn">Move</button>
                            </form>
                        </div>}
                </div>}
            </div>
            {(list.cards && list.cards.length > 0) && <div>
                {list.cards.map((card, cardIdx) => {
                    return (
                        <Draggable draggableId={card._id} key={card._id} index={cardIdx}>
                            {(provided, snapshot) => (
                                <div className="card"
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={getItemStyle(
                                        snapshot.isDragging,
                                        provided.draggableProps.style
                                    )}
                                >
                                    <CardPreview
                                        card={card}
                                        cardIdx={cardIdx}
                                        list={list}
                                        listIdx={listIdx}
                                        board={board}
                                        key={card._id}
                                        deleteCard={deleteCard}
                                        updateCardTitle={updateCardTitle}
                                        copyCard={addCard}
                                        moveCard={moveCard} />
                                </div>
                            )}
                        </Draggable>
                    )
                })}
            </div>}
            {!board.isTemplate && <AddCard addCard={addCard} />}
        </section >
    )
}

function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}