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
    const { list, listIdx } = props;

    const [listToEdit, updateListToEdit] = useState(list);
    const [isListActionOpen, toggleListAction] = useState(false);
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

    return (
        <section className="list-preview">
            {(list && listToEdit) && <form className="list-title-form">
                <textarea ref={listTitleRef} className="list-title-textarea" name="title" value={listToEdit.title}
                    onChange={(ev) => updateListToEdit({...listToEdit, [ev.target.name]:ev.target.value})} onKeyDown={onEnterPress}
                    onBlur={updateListTitle}>
                </textarea>
            </form>}
            <button onClick={() => toggleListAction(true)} className="list-menu-icon"><i className="fas fa-ellipsis-h"></i></button>
            {isListActionOpen && <div ref={node} className="list-actions">
                <button className="close-btn" onClick={() => toggleListAction(false)}><i className="fas fa-times"></i></button>
                <p>List Actions</p>
                <ul>
                    <li onClick={onDeleteList}>Delete List</li>
                </ul>
            </div>}
            {(list.cards && list.cards.length > 0) && <div>
                {list.cards.map((card, idx) => {
                    return (
                        <Draggable draggableId={card._id} key={card._id} index={idx}>
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
                                        key={card._id}
                                        deleteCard={deleteCard}
                                        updateCardTitle={updateCardTitle}
                                        copyCard={addCard} />
                                </div>
                            )}
                        </Draggable>
                    )
                })}
            </div>}
            <AddCard addCard={addCard} />
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