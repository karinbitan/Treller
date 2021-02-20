import { useRef, useState } from 'react';
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
    const [listTitleToEdit, updateListToEditTitle] = useState(props.list.title);
    const [isListActionOpen, toggleListAction] = useState(false);
    // const [currListIdx, setCurrListIdx] = useState('');

    const { list, listIdx } = props;
    const { provided, innerRef, isDraggingOver } = props;

    const listTitleRef = useRef(null);

    const onEnterPress = (ev) => {
        if (ev.keyCode === 13 && ev.shiftKey === false) {
            ev.preventDefault();
            updateListTitle(ev);
            // this.handleChange(ev);
        }
    }

    const updateListTitle = (ev) => {
        ev.preventDefault();
        props.updateListTitle(listIdx, listTitleToEdit);
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
            {list && <form>
                <textarea ref={listTitleRef} className="list-title" name="title" value={listTitleToEdit}
                    onChange={(ev) => updateListToEditTitle(ev.target.value)} onKeyDown={onEnterPress}
                    onBlur={updateListTitle}>
                </textarea>
            </form>}
            <button onClick={() => toggleListAction(true)} className="list-menu-icon"><i className="fas fa-ellipsis-h"></i></button>
            {isListActionOpen && <div className="list-actions">
                <button className="close-btn" onClick={() => toggleListAction(false)}><i className="fas fa-times"></i></button>
                <p>List Actions</p>
                <ul>
                    <li onClick={onDeleteList}>Delete List</li>
                </ul>
            </div>}
            {(list.cards && list.cards.length > 0) && <div className={"card-container" + (isDraggingOver ? " isDraggingOver" : "")}
                {...provided.droppableProps}
                ref={innerRef}>
                {list.cards.map((card, idx) => {
                    if (card)
                        return (
                            <Draggable draggableId={card._id} key={card._id} index={idx}>
                                {(provided, snapshot) => (
                                    <div className="card"
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        style={getItemStyle(
                                            snapshot.isDragging,
                                            provided.draggableProps.style
                                        )}
                                        ref={provided.innerRef}>
                                        <CardPreview
                                            provided={provided}
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
                {provided.placeholder}
            </div>}
            <AddCard addCard={addCard} />
        </section >
    )
}